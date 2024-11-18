'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Moon, Sun, Pencil, Trash } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type Product = {
  id: string;
  price: string;
  date: Date | undefined;
  description: string;
}

export default function Component() {
  const [price, setPrice] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPrice(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setProducts(products.map(product => 
        product.id === editingId 
          ? { ...product, price, date, description }
          : product
      ))
      setEditingId(null)
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        price,
        date,
        description
      }
      setProducts([...products, newProduct])
    }
    setPrice('')
    setDate(undefined)
    setDescription('')
  }

  const handleEdit = (product: Product) => {
    setPrice(product.price)
    setDate(product.date)
    setDescription(product.description)
    setEditingId(product.id)
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-900 transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Money Manager</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
        <Card className="mb-8 dark:bg-gray-800 max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</Label>
                <Input
                  id="price"
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? 'Update Product' : 'Add Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <Card 
              key={product.id} 
              className={`dark:bg-gray-800 ${hoveredProduct === product.id ? 'hover:bg-gray-700' : ''} ${selectedProduct === product.id ? 'bg-gray-700' : ''}`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => setSelectedProduct(product.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ${product.price}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: {product.date ? format(product.date, 'PP') : 'Not set'}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  aria-label={`Edit product ${product.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  aria-label={`Delete product ${product.id}`}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}