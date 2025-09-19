"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { PRODUCTS_LIST, type ProductData } from "@/lib/products-data"
import { PAYMENT_METHODS_LIST } from "@/lib/payment-methods"
import { Trash2, Edit, ArrowRight, ArrowLeft, RotateCcw, Copy, Check, Info, Loader2 } from "lucide-react"
import Image from "next/image"

interface Duration {
  id: string
  duration: string | "lifetime"
  price: string
  url: string
}

interface ProductWithDurations {
  id: string
  name: string
  imageUrl: string
  payments: string[]
  durations: Duration[]
}

interface JsonBuilderData {
  resellerName: string
  resellerPfp: string
  products: ProductWithDurations[]
}

export default function PanelPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<JsonBuilderData>({
    resellerName: "",
    resellerPfp: "",
    products: [],
  })
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [editingPaymentProductId, setEditingPaymentProductId] = useState<string | null>(null)
  const [tempPaymentInput, setTempPaymentInput] = useState<string[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [toasts, setToasts] = useState<
    Array<{ id: string; title: string; description: string; type: "success" | "error" }>
  >([])

  const showToast = useCallback((title: string, description: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4000)
  }, [])

  const validateStep1 = useCallback(() => {
    return data.resellerName.trim() && data.resellerPfp.trim()
  }, [data.resellerName, data.resellerPfp])

  const validateAddProduct = useCallback(() => {
    return selectedProduct && selectedPayments.length > 0
  }, [selectedProduct, selectedPayments])

  const validateStep2 = useCallback(() => {
    return data.products.length > 0
  }, [data.products])

  const parseDurationInput = (input: string): string => {
    const lowerInput = input.toLowerCase().trim()

    if (lowerInput === "lifetime") {
      return "lifetime"
    }

    const dayMatch = lowerInput.match(/(\d+)\s*(days?)/)
    if (dayMatch) {
      return dayMatch[1]
    }

    const monthMatch = lowerInput.match(/(\d+)\s*(months?)/)
    if (monthMatch) {
      return (Number.parseInt(monthMatch[1]) * 30).toString()
    }

    const yearMatch = lowerInput.match(/(\d+)\s*(years?)/)
    if (yearMatch) {
      return (Number.parseInt(yearMatch[1]) * 365).toString()
    }

    const numberMatch = lowerInput.match(/^(\d+)$/)
    if (numberMatch) {
      return numberMatch[1]
    }

    return ""
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const resetAll = () => {
    setCurrentStep(1)
    setData({ resellerName: "", resellerPfp: "", products: [] })
    setSelectedProduct(null)
    setSelectedPayments([])
    setEditingPaymentProductId(null)
    setTempPaymentInput([])
    showToast("Builder Reset!", "All fields have been cleared.")
  }

  const addProduct = async () => {
    if (!validateStep1()) {
      showToast("Missing Reseller Info", "Please fill in Reseller Name and Profile Picture URL first.", "error")
      return
    }

    if (!validateAddProduct()) {
      showToast("Missing Product Info", "Please select a Product and at least one Payment Method.", "error")
      return
    }

    if (data.products.some((p) => p.name.toLowerCase() === selectedProduct!.title.toLowerCase())) {
      showToast("Product Already Added", `'${selectedProduct!.title}' is already in your list.`, "error")
      return
    }

    setIsAddingProduct(true)

    const newProduct: ProductWithDurations = {
      id: generateId(),
      name: selectedProduct!.title.toLowerCase(),
      imageUrl: selectedProduct!.image,
      payments: [...selectedPayments],
      durations: [],
    }

    setData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))

    setSelectedProduct(null)
    setSelectedPayments([])
    showToast("Product Added!", `'${newProduct.name}' has been added.`)

    setTimeout(() => {
      setIsAddingProduct(false)
    }, 500)
  }

  const removeProduct = (id: string, name: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }))
    showToast("Product Removed!", `'${name}' has been removed.`)
  }

  const addDuration = (productId: string, durationInput: string, priceInput: string, urlInput: string) => {
    const parsedDuration = parseDurationInput(durationInput)

    if (!parsedDuration || !priceInput.trim() || !urlInput.trim()) {
      showToast("Missing or Invalid Duration Info", "Please enter a valid duration, price, and URL.", "error")
      return
    }

    const newDuration: Duration = {
      id: generateId(),
      duration: parsedDuration,
      price: priceInput.trim(),
      url: urlInput.trim(),
    }

    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId ? { ...product, durations: [...product.durations, newDuration] } : product,
      ),
    }))

    const product = data.products.find((p) => p.id === productId)
    const durationText = parsedDuration === "lifetime" ? "Lifetime" : parsedDuration + " days"
    showToast("Duration Added!", `'${durationText}' added to ${product?.name}.`)
  }

  const removeDuration = (productId: string, durationId: string, durationValue: string, productName: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId
          ? { ...product, durations: product.durations.filter((d) => d.id !== durationId) }
          : product,
      ),
    }))

    const durationText = durationValue === "lifetime" ? "Lifetime" : durationValue + " days"
    showToast("Duration Removed!", `'${durationText}' removed from ${productName}.`)
  }

  const generateJsonOutput = () => {
    if (!data.resellerName.trim()) {
      return "{}"
    }

    const resellerData: any = {
      pfp: data.resellerPfp.trim(),
    }

    data.products.forEach((product) => {
      const productDetails: any = {
        payments: product.payments,
      }

      product.durations.forEach((duration) => {
        productDetails[duration.duration] = {
          price: duration.price,
          url: duration.url,
        }
      })

      resellerData[product.name] = productDetails
    })

    const finalJson = {
      [data.resellerName.trim()]: resellerData,
    }

    return JSON.stringify(finalJson, null, 2)
  }

  const copyJson = async () => {
    const jsonText = generateJsonOutput()

    try {
      await navigator.clipboard.writeText(jsonText)
      setCopySuccess(true)
      showToast("JSON Copied!", "The generated JSON has been copied to your clipboard.")

      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (error) {
      showToast("Copy Failed", "Failed to copy JSON to clipboard.", "error")
    }
  }

  return (
    <div className="container">
      <h1 className="main-title">JSON Builder for Reseller Products</h1>

      {currentStep !== 3 && (
        <div className="reset-container">
          <button className="btn btn-outline" onClick={resetAll}>
            <RotateCcw className="icon" />
            Reset All
          </button>
        </div>
      )}

      <div className="grid-container">
        <div className="left-section">
          {/* Step 1: Reseller Information */}
          {currentStep === 1 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  Reseller Information
                  <div className="tooltip">
                    <Info className="icon info-icon" />
                    <span className="tooltip-text">Enter the name of the reseller and their profile picture URL</span>
                  </div>
                </h2>
              </div>
              <div className="card-content">
                <div className="form-group">
                  <label>Reseller Name</label>
                  <input
                    type="text"
                    placeholder="e.g., voxlis"
                    value={data.resellerName}
                    onChange={(e) => setData((prev) => ({ ...prev, resellerName: e.target.value }))}
                  />
                  <p className="form-help">This will be the main key in your JSON.</p>
                </div>

                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input
                    type="text"
                    placeholder="e.g., https://cdn.discordapp.com/attachments/..."
                    value={data.resellerPfp}
                    onChange={(e) => setData((prev) => ({ ...prev, resellerPfp: e.target.value }))}
                  />
                  <p className="form-help">Direct link to the reseller's profile picture.</p>

                  {data.resellerPfp.trim() && (
                    <div className="pfp-preview">
                      <p className="preview-label">Profile Picture Preview:</p>
                      <Image
                        src={data.resellerPfp.trim() || "/placeholder.svg?height=120&width=120&query=profile"}
                        alt="Profile Picture Preview"
                        width={120}
                        height={120}
                        className="pfp-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/abstract-profile.png"
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary btn-full"
                  disabled={!validateStep1()}
                  onClick={() => setCurrentStep(2)}
                >
                  Next
                  <ArrowRight className="icon" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Product Management */}
          {currentStep === 2 && (
            <div className="left-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    Add New Product
                    <div className="tooltip">
                      <Info className="icon info-icon" />
                      <span className="tooltip-text">Select a product and its payment methods</span>
                    </div>
                  </h2>
                </div>
                <div className="card-content">
                  <div className="form-group">
                    <label>Select Product</label>
                    <div className="product-grid">
                      {PRODUCTS_LIST.filter((product) => !product.hide).map((product) => (
                        <div
                          key={product.id}
                          className={`product-item ${selectedProduct?.id === product.id ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedProduct(product)
                            showToast("Product Selected!", `'${product.title}' has been selected.`)
                          }}
                        >
                          <Image
                            src={product.image || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={product.title}
                            width={64}
                            height={64}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/diverse-products-still-life.png"
                            }}
                          />
                          <span>{product.title}</span>
                        </div>
                      ))}
                    </div>
                    <p className="form-help">
                      {selectedProduct
                        ? `Selected Product: ${selectedProduct.title}`
                        : "Please select a product from the list above."}
                    </p>
                  </div>

                  <div className="form-group">
                    <label>Payment Methods</label>
                    <div className="payment-options">
                      {PAYMENT_METHODS_LIST.map((payment) => (
                        <button
                          key={payment.id}
                          className={`payment-btn ${selectedPayments.includes(payment.id) ? "selected" : ""}`}
                          onClick={() => {
                            if (selectedPayments.includes(payment.id)) {
                              setSelectedPayments((prev) => prev.filter((p) => p !== payment.id))
                            } else {
                              setSelectedPayments((prev) => [...prev, payment.id])
                            }
                          }}
                        >
                          {payment.name}
                        </button>
                      ))}
                    </div>
                    <p className="form-help">Click to select accepted payment methods.</p>
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    disabled={!validateAddProduct() || isAddingProduct}
                    onClick={addProduct}
                  >
                    {isAddingProduct && <Loader2 className="icon spinner" />}
                    {isAddingProduct ? "Adding Product..." : "Add Product"}
                  </button>
                </div>
              </div>

              {/* Manage Products */}
              {data.products.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      Manage Products & Durations
                      <div className="tooltip">
                        <Info className="icon info-icon" />
                        <span className="tooltip-text">Define prices and URLs for different durations</span>
                      </div>
                    </h2>
                  </div>
                  <div className="card-content">
                    <div className="products-list">
                      {data.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onRemove={removeProduct}
                          onAddDuration={addDuration}
                          onRemoveDuration={removeDuration}
                          editingPaymentProductId={editingPaymentProductId}
                          setEditingPaymentProductId={setEditingPaymentProductId}
                          tempPaymentInput={tempPaymentInput}
                          setTempPaymentInput={setTempPaymentInput}
                          setData={setData}
                          showToast={showToast}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="step-navigation">
                <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="icon" />
                  Go Back
                </button>
                <button className="btn btn-primary" disabled={!validateStep2()} onClick={() => setCurrentStep(3)}>
                  Done
                  <ArrowRight className="icon" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Output */}
          {currentStep === 3 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Final JSON Output</h2>
              </div>
              <div className="card-content text-center">
                <p className="form-help">Your JSON is ready! Copy it from the right panel.</p>
                <div className="step-navigation">
                  <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="icon" />
                    Go Back
                  </button>
                  <button className="btn btn-primary" onClick={resetAll}>
                    <RotateCcw className="icon" />
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* JSON Output Panel */}
        <div className="right-section">
          <div className="json-output-card card">
            <div className="card-header">
              <h2 className="card-title">
                Generated JSON Output
                <div className="tooltip">
                  <Info className="icon info-icon" />
                  <span className="tooltip-text">Live JSON output based on your inputs</span>
                </div>
              </h2>
            </div>
            <div className="json-content">
              <pre className="json-pre">
                <code>{generateJsonOutput()}</code>
              </pre>
            </div>
            <div className="json-footer">
              <button className="btn btn-primary btn-full" onClick={copyJson}>
                {copySuccess ? (
                  <>
                    <Check className="icon" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="icon" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-description">{toast.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({
  product,
  onRemove,
  onAddDuration,
  onRemoveDuration,
  editingPaymentProductId,
  setEditingPaymentProductId,
  tempPaymentInput,
  setTempPaymentInput,
  setData,
  showToast,
}: {
  product: ProductWithDurations
  onRemove: (id: string, name: string) => void
  onAddDuration: (productId: string, duration: string, price: string, url: string) => void
  onRemoveDuration: (productId: string, durationId: string, durationValue: string, productName: string) => void
  editingPaymentProductId: string | null
  setEditingPaymentProductId: (id: string | null) => void
  tempPaymentInput: string[]
  setTempPaymentInput: (payments: string[]) => void
  setData: React.Dispatch<React.SetStateAction<JsonBuilderData>>
  showToast: (title: string, description: string, type?: "success" | "error") => void
}) {
  const [durationInput, setDurationInput] = useState("")
  const [priceInput, setPriceInput] = useState("")
  const [urlInput, setUrlInput] = useState("")

  const handleAddDuration = () => {
    onAddDuration(product.id, durationInput, priceInput, urlInput)
    setDurationInput("")
    setPriceInput("")
    setUrlInput("")
  }

  const editPayments = () => {
    setEditingPaymentProductId(product.id)
    setTempPaymentInput([...product.payments])
  }

  const savePayments = () => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === product.id ? { ...p, payments: [...tempPaymentInput] } : p)),
    }))
    setEditingPaymentProductId(null)
    setTempPaymentInput([])
    showToast("Payments Updated!", "Payment methods have been saved.")
  }

  const cancelEditPayments = () => {
    setEditingPaymentProductId(null)
    setTempPaymentInput([])
    showToast("Edit Canceled", "Payment method changes were discarded.")
  }

  return (
    <div className="product-card">
      <div className="product-header">
        <div className="product-info">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=40&width=40&query=product"}
            alt={product.name}
            width={40}
            height={40}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/diverse-products-still-life.png"
            }}
          />
          <h3>{product.name}</h3>
        </div>
        <button className="btn btn-outline btn-icon" onClick={() => onRemove(product.id, product.name)}>
          <Trash2 className="icon" />
        </button>
      </div>

      <div className="product-payments">
        <span>Payments:</span>
        {editingPaymentProductId === product.id ? (
          <div>
            <div className="payment-options">
              {PAYMENT_METHODS_LIST.map((payment) => (
                <button
                  key={payment.id}
                  className={`payment-btn ${tempPaymentInput.includes(payment.id) ? "selected" : ""}`}
                  onClick={() => {
                    if (tempPaymentInput.includes(payment.id)) {
                      setTempPaymentInput((prev) => prev.filter((p) => p !== payment.id))
                    } else {
                      setTempPaymentInput((prev) => [...prev, payment.id])
                    }
                  }}
                >
                  {payment.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button className="btn btn-primary btn-sm" onClick={savePayments}>
                Save
              </button>
              <button className="btn btn-outline btn-sm" onClick={cancelEditPayments}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {product.payments.length > 0 ? (
              product.payments.map((payment) => {
                const paymentMethod = PAYMENT_METHODS_LIST.find((p) => p.id === payment)
                return (
                  <span key={payment} className="badge">
                    {paymentMethod?.name || payment}
                  </span>
                )
              })
            ) : (
              <span className="badge badge-outline">No payments specified</span>
            )}
            <button className="btn btn-outline btn-icon btn-sm" onClick={editPayments}>
              <Edit className="icon" />
            </button>
          </>
        )}
      </div>

      <div className="duration-section">
        <h4>Add Duration for {product.name}</h4>
        <div className="duration-form">
          <div className="form-group">
            <label>Duration (Days)</label>
            <input
              type="text"
              placeholder="e.g., 7 days, 1 month, lifetime, 30"
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
            />
            <p className="form-help">Enter duration or 'lifetime'</p>
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              placeholder="e.g., 8.99, 15.00"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
            />
            <p className="form-help">Enter the price</p>
          </div>
          <div className="form-group">
            <label>Product URL</label>
            <input
              type="text"
              placeholder="e.g., https://yourstore.com/purchase/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <p className="form-help">Direct purchase link</p>
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleAddDuration}>
          Add Duration
        </button>

        {product.durations.length > 0 && (
          <div className="duration-list">
            <h4>Existing Durations:</h4>
            {product.durations.map((duration) => (
              <div key={duration.id} className="duration-item">
                <span>
                  <strong>{duration.duration === "lifetime" ? "Lifetime" : duration.duration + " days"}:</strong> $
                  {duration.price} (
                  <a href={duration.url} target="_blank" rel="noopener noreferrer" className="duration-link">
                    Link
                  </a>
                  )
                </span>
                <button
                  className="btn btn-outline btn-icon btn-sm"
                  onClick={() => onRemoveDuration(product.id, duration.id, duration.duration, product.name)}
                >
                  <Trash2 className="icon" />
                </button>
              </div>
            ))}
          </div>
        )}

        {product.durations.length === 0 && (
          <p className="form-help">No durations added for this product yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}
