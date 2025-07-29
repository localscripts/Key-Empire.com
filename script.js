const API_CONFIG = {
  baseUrl: "https://api.voxlis.net",
  endpoints: {
    resellers: "/resellers",
    lastUpdate: "/resellers/last-update",
  },
  cacheTimeout: 10 * 60 * 1000,
  updateCheckInterval: 10 * 1000,
}

const CacheManager = {
  get: (key) => {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const data = JSON.parse(cached)
      if (Date.now() > data.expiry) {
        localStorage.removeItem(key)
        return null
      }

      return data.value
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  },

  set: (key, value, timeout = API_CONFIG.cacheTimeout) => {
    try {
      const data = {
        value: value,
        expiry: Date.now() + timeout,
      }
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Cache set error:", error)
    }
  },

  clear: (key) => {
    localStorage.removeItem(key)
  },
}

class ResellerAPI {
  constructor() {
    this.isLoading = false
    this.lastFetch = null
    this.lastUpdateTimestamp = null
    this.updateCheckTimer = null
    this.isCheckingUpdates = false
  }

  async fetchResellers(forceRefresh = false) {
    const cacheKey = "resellers_data"

    if (!forceRefresh) {
      const cached = CacheManager.get(cacheKey)
      if (cached) {
        console.log("Using cached reseller data")
        this.startUpdateChecking()
        return this.transformApiData(cached.data || cached)
      }
    }

    if (this.isLoading) {
      console.log("Fetch already in progress, waiting...")
      return this.waitForCurrentFetch()
    }

    this.isLoading = true

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.resellers}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiResponse = await response.json()

      if (apiResponse.error) {
        throw new Error(apiResponse.message || "API returned error")
      }

      const data = apiResponse.data || apiResponse
      const lastUpdate = apiResponse.last_update || Date.now()
      const cacheExpiresIn = apiResponse.cache_expires_in || API_CONFIG.cacheTimeout / 1000

      CacheManager.set(cacheKey, { data, last_update: lastUpdate }, cacheExpiresIn * 1000)

      this.lastUpdateTimestamp = lastUpdate

      const transformedData = this.transformApiData(data)
      this.lastFetch = Date.now()

      console.log("Reseller data fetched successfully")

      this.startUpdateChecking()

      return transformedData
    } catch (error) {
      console.error("Failed to fetch resellers:", error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  async checkForUpdates() {
    if (this.isCheckingUpdates) return false

    this.isCheckingUpdates = true

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.lastUpdate}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-cache",
      })

      if (!response.ok) {
        console.warn("Failed to check for updates")
        return false
      }

      const updateInfo = await response.json()
      const serverLastUpdate = updateInfo.last_update

      if (this.lastUpdateTimestamp && serverLastUpdate > this.lastUpdateTimestamp) {
        console.log("🔥 UPDATE DETECTED! Server has newer data")
        return true
      }

      return false
    } catch (error) {
      console.warn("Error checking for updates:", error)
      return false
    } finally {
      this.isCheckingUpdates = false
    }
  }

  startUpdateChecking() {
    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer)
    }

    this.updateCheckTimer = setInterval(async () => {
      const hasUpdates = await this.checkForUpdates()
      if (hasUpdates) {
        console.log("🚀 Auto-refreshing data due to server changes...")
        await this.handleAutoUpdate()
      }
    }, API_CONFIG.updateCheckInterval)

    console.log("Started automatic update checking every 10 seconds")
  }

  async handleAutoUpdate() {
    try {
      this.showUpdateNotification()

      const freshData = await this.fetchResellers(true)

      await this.updateUI(freshData)

      console.log("✅ Auto-update completed successfully")
    } catch (error) {
      console.error("Auto-update failed:", error)
    }
  }

  showUpdateNotification() {
    const notification = document.createElement("div")
    notification.className = "update-notification"
    notification.innerHTML = `
      <div class="update-content">
        <svg class="update-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>Updating reseller data...</span>
      </div>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  async updateUI(newData) {
    allResellers = newData
    filteredResellers = [...allResellers]

    applyFilters()

    const tableBody = document.getElementById("resellerTableBody")
    if (tableBody) {
      tableBody.style.transition = "opacity 0.3s ease"
      tableBody.style.opacity = "0.5"

      setTimeout(() => {
        renderTable()
        renderPagination()
        updateStats()
        updateSidebarPricing()

        tableBody.style.opacity = "1"
      }, 300)
    }
  }

  stopUpdateChecking() {
    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer)
      this.updateCheckTimer = null
      console.log("Stopped automatic update checking")
    }
  }

  async waitForCurrentFetch() {
    while (this.isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    const cached = CacheManager.get("resellers_data")
    return cached ? this.transformApiData(cached.data || cached) : []
  }

  transformApiData(apiData) {
    const transformed = []

    Object.entries(apiData).forEach(([resellerName, exploits]) => {
      if (typeof exploits !== "object" || exploits === null) return

      const isPremium = exploits._meta && exploits._meta.premium === true

      const compatibleProducts = Object.keys(exploits).filter((key) => key !== "_meta")

      if (compatibleProducts.length === 0) return

      const firstExploit = Object.values(exploits).find((val) => typeof val === "object" && val !== null && !val._meta)
      if (!firstExploit) return

      const prices = {}
      const purchaseUrls = {}
      const paymentMethods = []

      Object.entries(firstExploit).forEach(([key, value]) => {
        if (key === "payments") {
          paymentMethods.push(...value)
        } else if (typeof value === "object" && value.price) {
          const duration = this.mapDurationToKey(key)
          if (duration) {
            prices[duration] = `$${value.price}`
            if (value.url) {
              purchaseUrls[duration] = value.url
            }
          }
        }
      })

      transformed.push({
        name: resellerName,
        avatar: "public/macsploit.png",
        paymentMethods: [...new Set(paymentMethods)],
        prices: prices,
        purchaseUrls: purchaseUrls,
        compatibleProducts: compatibleProducts.map((p) => this.capitalizeFirst(p)),
        verified: Math.random() > 0.3,
        totalSales: Math.floor(Math.random() * 1000) + 100,
        joinDate: this.randomDate(),
        premium: isPremium,
      })
    })

    return transformed.sort((a, b) => {
      if (a.premium && !b.premium) return -1
      if (!a.premium && b.premium) return 1

      const priceA = Number.parseFloat(a.prices.daily?.replace("$", "") || "999")
      const priceB = Number.parseFloat(b.prices.daily?.replace("$", "") || "999")
      return priceA - priceB
    })
  }

  mapDurationToKey(duration) {
    const mapping = {
      1: "daily",
      7: "weekly",
      30: "monthly",
      90: "3months",
      180: "6months",
      365: "yearly",
    }
    return mapping[duration]
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  randomDate() {
    const start = new Date("2023-01-01")
    const end = new Date()
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return randomDate.toISOString().split("T")[0]
  }
}

let currentPage = 1
const itemsPerPage = 4
let selectedCategory = null
let filteredResellers = []
let allResellers = []
let sortOrder = "price-low"
const isLoading = false

const apiService = new ResellerAPI()

const animationConfig = {
  duration: 300,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
}

document.addEventListener("DOMContentLoaded", async () => {
  showLoadingScreen()
  setupEventListeners()
  setupIntersectionObserver()

  try {
    allResellers = await apiService.fetchResellers()
    filteredResellers = [...allResellers]

    renderTable()
    renderPagination()
    updateStats()
    updateSidebarPricing()
    initializeAnimations()
    setupKeyboardNavigation()

    console.log("Application initialized with", allResellers.length, "resellers")
  } catch (error) {
    console.error("Failed to initialize application:", error)
    showErrorState()
  } finally {
    setTimeout(hideLoadingScreen, 1500)
  }
})

window.addEventListener("beforeunload", () => {
  apiService.stopUpdateChecking()
})

function showErrorState() {
  const tableBody = document.getElementById("resellerTableBody")
  tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-8">
                <div class="error-state">
                    <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-white mb-2">Unable to Load Reseller Data</h3>
                    <p class="text-gray-400 mb-4">Failed to fetch data from the API. Please try refreshing the page.</p>
                    <button onclick="refreshData()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        Try Again
                    </button>
                </div>
            </td>
        </tr>
    `
}

function showLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")
  if (loadingScreen) {
    loadingScreen.classList.remove("hidden")
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")
  if (loadingScreen) {
    loadingScreen.classList.add("hidden")
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 300)
  }
}

async function refreshData() {
  const refreshBtn = document.getElementById("refreshBtn")
  const icon = refreshBtn?.querySelector(".btn-icon")

  if (icon) {
    icon.style.animation = "spin 1s linear infinite"
  }
  if (refreshBtn) {
    refreshBtn.disabled = true
  }

  try {
    allResellers = await apiService.fetchResellers(true)
    filteredResellers = [...allResellers]

    applyFilters()
    renderTable()
    renderPagination()
    updateStats()
    updateSidebarPricing()

    console.log("Data refreshed successfully")
  } catch (error) {
    console.error("Refresh failed:", error)
    showErrorState()
  } finally {
    if (icon) {
      icon.style.animation = "none"
    }
    if (refreshBtn) {
      refreshBtn.disabled = false
    }
  }
}

function updateSidebarPricing() {
  const categoryLinks = document.querySelectorAll(".category-link")
  
  categoryLinks.forEach(link => {
    const category = link.getAttribute("data-category")
    const priceElement = link.querySelector(".price-text")
    
    if (category === "all") {
      let lowestPrice = Infinity
      let firstProductIcon = null
      
      allResellers.forEach(reseller => {
        if (reseller.prices.daily) {
          const price = parseFloat(reseller.prices.daily.replace("$", ""))
          if (price < lowestPrice) {
            lowestPrice = price
            if (reseller.compatibleProducts.length > 0) {
              firstProductIcon = getProductIcon(reseller.compatibleProducts[0])
            }
          }
        }
      })
      
      if (lowestPrice !== Infinity) {
        priceElement.textContent = `From $${lowestPrice.toFixed(2)}`
        
        const allProductsIcon = document.getElementById("allProductsIcon")
        if (allProductsIcon && firstProductIcon) {
          allProductsIcon.src = firstProductIcon
          allProductsIcon.alt = "Lowest Price Product Icon"
        }
      }
    } else {
      let lowestPrice = Infinity
      
      allResellers.forEach(reseller => {
        const hasProduct = reseller.compatibleProducts.some(product => 
          product.toLowerCase().includes(category.toLowerCase())
        )
        
        if (hasProduct && reseller.prices.daily) {
          const price = parseFloat(reseller.prices.daily.replace("$", ""))
          if (price < lowestPrice) {
            lowestPrice = price
          }
        }
      })
      
      if (lowestPrice !== Infinity) {
        priceElement.textContent = `From $${lowestPrice.toFixed(2)}`
      }
    }
  })
}

function getProductIcon(productName) {
  const iconMap = {
    'zenith': 'public/zenith.png',
    'ronin': 'public/ronin.png',
    'wave': 'public/wave.png',
    'exoliner': 'public/exoliner.png',
    'cryptic': 'public/cryptic.png',
    'arceus x': 'public/arceusx.png',
    'fluxus': 'public/fluxus.png',
    'macsploit': 'public/macsploit.png',
    'bunni': 'public/bunni.png'
  }
  
  return iconMap[productName.toLowerCase()] || 'public/macsploit.png'
}

function renderTable() {
  const tableBody = document.getElementById("resellerTableBody")
  const priceDurations = ["daily", "weekly", "monthly", "3months", "6months", "yearly"]

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentResellers = filteredResellers.slice(indexOfFirstItem, indexOfLastItem)

  let tableHTML = ""

  currentResellers.forEach((reseller, index) => {
    const isCheapest = index === 0 && sortOrder === "price-low" && !reseller.premium
    const isPremium = reseller.premium === true
    const animationDelay = index * 0.1
    const premiumClass = isPremium ? "premium-reseller" : ""

    tableHTML += `
            <tr class="reseller-row ${premiumClass}" style="animation-delay: ${animationDelay}s">
                <td class="table-cell rounded-l">
                    <div class="reseller-info">
                        <img src="${reseller.avatar}" alt="${reseller.name}" width="32" height="32" loading="lazy">
                        <div class="reseller-details">
                            <span class="reseller-name">${reseller.name}</span>
                            <div class="reseller-badges">
                                ${isPremium ? '<span class="badge premium">Premium</span>' : ""}
                                ${isCheapest ? '<span class="badge cheapest">Best Price</span>' : ""}
                                ${reseller.verified ? '<span class="badge verified">Verified</span>' : ""}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="table-cell">
                    <div class="payment-methods">
                        ${reseller.paymentMethods
                          .slice(0, 10)
                          .map((method) => getPaymentIcon(method))
                          .join("")}
                    </div>
                </td>
                ${priceDurations
                  .map((duration) => {
                    const price = reseller.prices[duration]
                    const purchaseUrl = reseller.purchaseUrls[duration]
                    const isLast = duration === "yearly"
                    const buttonClass = isPremium ? "premium" : isCheapest ? "cheapest" : "regular"

                    return `
                        <td class="table-cell min-w-120 ${isLast ? "rounded-r" : ""}">
                            ${
                              price
                                ? `<button class="price-button ${buttonClass}" onclick="handlePriceClick('${reseller.name}', '${duration}', '${price}', '${purchaseUrl || ""}')">${price}</button>`
                                : `<span class="not-available">Not Available</span>`
                            }
                        </td>
                    `
                  })
                  .join("")}
            </tr>
        `
  })

  tableBody.innerHTML = tableHTML

  setTimeout(() => {
    const rows = tableBody.querySelectorAll(".reseller-row")
    rows.forEach((row, index) => {
      row.style.opacity = "0"
      row.style.transform = "translateY(20px)"

      setTimeout(() => {
        row.style.transition = "all 0.3s ease"
        row.style.opacity = "1"
        row.style.transform = "translateY(0)"
      }, index * 100)
    })
  }, 50)
}

function setupEventListeners() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay")
  const mobileMenuClose = document.getElementById("mobileMenuClose")

  mobileMenuBtn?.addEventListener("click", () => {
    mobileMenuOverlay.classList.add("show")
    document.body.style.overflow = "hidden"
    animateHamburger(mobileMenuBtn, true)
  })

  mobileMenuClose?.addEventListener("click", () => {
    mobileMenuOverlay.classList.remove("show")
    document.body.style.overflow = ""
    animateHamburger(mobileMenuBtn, false)
  })

  mobileMenuOverlay?.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove("show")
      document.body.style.overflow = ""
      animateHamburger(mobileMenuBtn, false)
    }
  })

  const categoryLinks = document.querySelectorAll(".category-link")
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const category = link.getAttribute("data-category")
      selectCategory(category === "all" ? null : category)
      createRippleEffect(e, link)
    })
  })

  const filterDropdownBtn = document.getElementById("filterDropdownBtn")
  const filterDropdownContent = document.getElementById("filterDropdownContent")

  filterDropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation()
    filterDropdownContent.classList.toggle("show")

    const arrow = filterDropdownBtn.querySelector(".dropdown-arrow")
    if (arrow) {
      arrow.style.transform = filterDropdownContent.classList.contains("show") ? "rotate(180deg)" : "rotate(0deg)"
    }
  })

  const dropdownItems = document.querySelectorAll(".dropdown-item")
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const sortType = item.getAttribute("data-sort")
      if (sortType) {
        sortOrder = sortType
        applySorting()
        renderTable()
        renderPagination()
        filterDropdownContent.classList.remove("show")

        const buttonText = filterDropdownBtn.querySelector("span")
        if (buttonText) {
          buttonText.textContent = item.textContent.trim()
        }

        const arrow = filterDropdownBtn.querySelector(".dropdown-arrow")
        if (arrow) {
          arrow.style.transform = "rotate(0deg)"
        }
      }
    })
  })

  document.addEventListener("click", (e) => {
    if (
      filterDropdownBtn &&
      filterDropdownContent &&
      !filterDropdownBtn.contains(e.target) &&
      !filterDropdownContent.contains(e.target)
    ) {
      filterDropdownContent.classList.remove("show")
      const arrow = filterDropdownBtn.querySelector(".dropdown-arrow")
      if (arrow) {
        arrow.style.transform = "rotate(0deg)"
      }
    }
  })

  const refreshBtn = document.getElementById("refreshBtn")
  refreshBtn?.addEventListener("click", refreshData)

  setupModalEventListeners()
}

function setupModalEventListeners() {
  const applyBtns = document.querySelectorAll("#applyBtn, #mobileApplyBtn")
  const applyModalOverlay = document.getElementById("applyModalOverlay")
  const applyModalClose = document.getElementById("applyModalClose")
  const submitApplyBtn = document.getElementById("submitApplyBtn")

  applyBtns.forEach((btn) => {
    btn?.addEventListener("click", (e) => {
      createRippleEffect(e, btn)
      showModal(applyModalOverlay)
      setTimeout(() => {
        document.getElementById("discordUsername")?.focus()
      }, 300)
    })
  })

  applyModalClose?.addEventListener("click", () => {
    hideModal(applyModalOverlay)
  })

  submitApplyBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = {
      discordUsername: document.getElementById("discordUsername").value.trim(),
      experience: document.getElementById("experience").value,
      motivation: document.getElementById("motivation").value.trim(),
    }

    if (!formData.discordUsername) {
      console.log("Discord username required")
      return
    }

    setButtonLoading(submitApplyBtn, true)

    setTimeout(() => {
      console.log("Apply for Reseller Submitted:", formData)
      hideModal(applyModalOverlay)
      clearApplyForm()
      setButtonLoading(submitApplyBtn, false)
    }, 1500)
  })

  const reportBtns = document.querySelectorAll("#reportBtn, #mobileReportBtn")
  const reportModalOverlay = document.getElementById("reportModalOverlay")
  const reportModalClose = document.getElementById("reportModalClose")
  const submitReportBtn = document.getElementById("submitReportBtn")

  reportBtns.forEach((btn) => {
    btn?.addEventListener("click", (e) => {
      createRippleEffect(e, btn)
      showModal(reportModalOverlay)
    })
  })

  reportModalClose?.addEventListener("click", () => {
    hideModal(reportModalOverlay)
  })

  submitReportBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = {
      softwareName: document.getElementById("reportSoftwareName").value.trim(),
      softwareType: document.querySelector('input[name="softwareType"]:checked')?.value,
      resellerName: document.getElementById("resellerName").value.trim(),
      resellerLink: document.getElementById("resellerLink").value.trim(),
      reportType: document.getElementById("reportType").value,
      reason: document.getElementById("reportReason").value.trim(),
      discordUsername: document.getElementById("reportDiscordUsername").value.trim(),
    }

    if (
      !formData.softwareName ||
      !formData.resellerName ||
      !formData.reportType ||
      !formData.reason ||
      !formData.discordUsername
    ) {
      console.log("All required fields must be filled")
      return
    }

    setButtonLoading(submitReportBtn, true)

    setTimeout(() => {
      console.log("Report Submitted:", formData)
      hideModal(reportModalOverlay)
      clearReportForm()
      setButtonLoading(submitReportBtn, false)
    }, 1500)
  })

  const requestSoftwareBtn = document.getElementById("requestSoftwareBtn")
  const requestSoftwareModalOverlay = document.getElementById("requestSoftwareModalOverlay")
  const requestSoftwareModalClose = document.getElementById("requestSoftwareModalClose")
  const submitRequestBtn = document.getElementById("submitRequestBtn")

  requestSoftwareBtn?.addEventListener("click", (e) => {
    createRippleEffect(e, requestSoftwareBtn)
    showModal(requestSoftwareModalOverlay)
  })

  requestSoftwareModalClose?.addEventListener("click", () => {
    hideModal(requestSoftwareModalOverlay)
  })

  submitRequestBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = {
      softwareName: document.getElementById("requestSoftwareName").value.trim(),
      softwareType: document.querySelector('input[name="requestSoftwareType"]:checked')?.value,
      description: document.getElementById("requestDescription").value.trim(),
      priority: document.getElementById("requestPriority").value,
    }

    if (!formData.softwareName) {
      console.log("Software name required")
      return
    }

    setButtonLoading(submitRequestBtn, true)

    setTimeout(() => {
      console.log("Request Software Submitted:", formData)
      hideModal(requestSoftwareModalOverlay)
      clearRequestForm()
      setButtonLoading(submitRequestBtn, false)
    }, 1500)
  })

  const modalOverlays = document.querySelectorAll(".modal-overlay")
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        hideModal(overlay)
      }
    })
  })
}

function showModal(modal) {
  modal.classList.add("show")
  document.body.style.overflow = "hidden"

  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  }
}

function hideModal(modal) {
  modal.classList.remove("show")
  document.body.style.overflow = ""
}

function selectCategory(category) {
  selectedCategory = category
  currentPage = 1

  const categoryLinks = document.querySelectorAll(".category-link")
  categoryLinks.forEach((link) => {
    link.classList.remove("active")
    const linkCategory = link.getAttribute("data-category")
    if ((category === null && linkCategory === "all") || linkCategory === category) {
      link.classList.add("active")

      if (window.innerWidth < 1024) {
        link.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  })

  setLoadingState(true)

  setTimeout(() => {
    applyFilters()
    renderTable()
    renderPagination()
    updateStats()
    setLoadingState(false)
  }, 300)
}

function applyFilters() {
  let filtered = [...allResellers]

  if (selectedCategory !== null) {
    filtered = filtered.filter((reseller) =>
      reseller.compatibleProducts.some((product) => product.toLowerCase().includes(selectedCategory.toLowerCase())),
    )
  }

  filteredResellers = filtered
  applySorting()
}

function applySorting() {
  switch (sortOrder) {
    case "price-low":
      filteredResellers.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1

        const priceA = Number.parseFloat(a.prices.daily?.replace("$", "") || "999")
        const priceB = Number.parseFloat(b.prices.daily?.replace("$", "") || "999")
        return priceA - priceB
      })
      break
    case "price-high":
      filteredResellers.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1

        const priceA = Number.parseFloat(a.prices.daily?.replace("$", "") || "0")
        const priceB = Number.parseFloat(b.prices.daily?.replace("$", "") || "0")
        return priceB - priceA
      })
      break
    case "popular":
      filteredResellers.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1

        return (b.totalSales || 0) - (a.totalSales || 0)
      })
      break
    case "verified":
      filteredResellers.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1

        if (a.verified && !b.verified) return -1
        if (!a.verified && b.verified) return 1
        return (b.totalSales || 0) - (a.totalSales || 0)
      })
      break
    default:
      break
  }
}

function getPaymentIcon(method) {
  const icons = {
    "credit-card": `<svg class="payment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>`,

    paypal: `<svg class="payment-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.9.9 0 0 0-.89.804l-1.33 8.43a.48.48 0 0 0 .473.56h3.355c.435 0 .802-.31.87-.73l.038-.195.72-4.555.046-.24a.87.87 0 0 1 .87-.73h.548c3.585 0 6.39-1.455 7.205-5.66.34-1.755.166-3.22-.697-4.295a4.252 4.252 0 0 0-1.029-.809z"/>
        </svg>`,

    crypto: `<svg class="payment-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
            <path fill="#fff" d="M16.455 11.311c.2-1.338-.82-2.057-2.213-2.537l.452-1.813-1.104-.275-.44 1.767c-.29-.072-.588-.14-.885-.207l.443-1.776-1.104-.275-.452 1.813c-.24-.055-.475-.109-.704-.167l.001-.004-1.523-.38-.294 1.178s.82.188.803.2c.448.112.529.408.515.643l-.516 2.067c.031.008.071.019.115.035-.037-.009-.076-.018-.117-.027l-.722 2.898c-.055.136-.194.34-.507.263.011.016-.803-.2-.803-.2l-.549 1.261 1.438.358c.267.067.529.137.786.202l-.456 1.83 1.104.275.452-1.813c.299.081.59.155.875.226l-.45 1.804 1.104.275.456-1.83c1.88.356 3.293.212 3.89-1.487.48-1.364-.024-2.153-1.005-2.668.715-.165 1.254-.637 1.398-1.61zm-2.498 3.503c-.341 1.367-2.645.628-3.39.442l.604-2.424c.746.186 3.141.555 2.786 1.982zm.341-3.525c-.311 1.242-2.236.611-2.862.456l.548-2.196c.626.156 2.638.447 2.314 1.74z"/>
        </svg>`,

    bitcoin: `<svg class="payment-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
            <path fill="#fff" d="M16.455 11.311c.2-1.338-.82-2.057-2.213-2.537l.452-1.813-1.104-.275-.44 1.767c-.29-.072-.588-.14-.885-.207l.443-1.776-1.104-.275-.452 1.813c-.24-.055-.475-.109-.704-.167l.001-.004-1.523-.38-.294 1.178s.82.188.803.2c.448.112.529.408.515.643l-.516 2.067c.031.008.071.019.115.035-.037-.009-.076-.018-.117-.027l-.722 2.898c-.055.136-.194.34-.507.263.011.016-.803-.2-.803-.2l-.549 1.261 1.438.358c.267.067.529.137.786.202l-.456 1.83 1.104.275.452-1.813c.299.081.59.155.875.226l-.45 1.804 1.104.275.456-1.83c1.88.356 3.293.212 3.89-1.487.48-1.364-.024-2.153-1.005-2.668.715-.165 1.254-.637 1.398-1.61zm-2.498 3.503c-.341 1.367-2.645.628-3.39.442l.604-2.424c.746.186 3.141.555 2.786 1.982zm.341-3.525c-.311 1.242-2.236.611-2.862.456l.548-2.196c.626.156 2.638.447 2.314 1.74z"/>
        </svg>`,

    stripe: `<svg class="payment-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
        </svg>`,

    cashapp: `<svg class="payment-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.59 3.475c-.905.85-2.175 1.35-3.525 1.35-.675 0-1.35-.15-1.95-.45l-.075-.075c-.525-.225-1.125-.375-1.725-.375-1.275 0-2.475.525-3.375 1.425L12 6.3l-.975-.975c-.9-.9-2.1-1.425-3.375-1.425-.6 0-1.2.15-1.725.375l-.075.075c-.6.3-1.275.45-1.95.45-1.35 0-2.625-.5-3.525-1.35L0 3.825l.375-.375c1.05-1.05 2.475-1.65 3.975-1.65.825 0 1.65.15 2.4.45.75-.3 1.575-.45 2.4-.45 1.5 0 2.925.6 3.975 1.65L12 2.325l-.875-.875c1.05-1.05 2.475-1.65 3.975-1.65.825 0 1.65.15 2.4.45.75-.3 1.575-.45 2.4-.45 1.5 0 2.925.6 3.975 1.65l.375.375-.375.375z"/>
        </svg>`,

    venmo: `<svg class="payment-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.4 1.6c.5 2.6.1 5.8-1.2 9.6L15.9 24H9.5l-4.7-19.2 6.4-.6 2.3 12.8c1.4-2.4 2.7-5.4 3.2-8.7L22.4 1.6z"/>
        </svg>`,
  }
  return icons[method] || ""
}

function handlePriceClick(resellerName, duration, price, purchaseUrl) {
  console.log("Price clicked:", { resellerName, duration, price, purchaseUrl })

  if (purchaseUrl && purchaseUrl !== "" && purchaseUrl !== "undefined") {
    window.open(purchaseUrl, "_blank", "noopener,noreferrer")
  } else {
    console.log("No purchase URL available for this item")
  }
}

function renderPagination() {
  const paginationControls = document.getElementById("paginationControls")
  const totalPages = Math.ceil(filteredResellers.length / itemsPerPage)

  if (totalPages <= 1) {
    paginationControls.innerHTML = ""
    return
  }

  let paginationHTML = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span class="sr-only">Previous page</span>
        </button>
        <div style="display: flex; gap: 0.25rem;">
    `

  const showPages = []
  const delta = 2

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    showPages.push(i)
  }

  if (currentPage - delta > 2) {
    showPages.unshift("...")
  }
  if (currentPage + delta < totalPages - 1) {
    showPages.push("...")
  }

  showPages.unshift(1)
  if (totalPages !== 1) {
    showPages.push(totalPages)
  }

  showPages.forEach((page, index) => {
    if (page === "...") {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`
    } else {
      paginationHTML += `
                <button class="pagination-btn pagination-number ${page === currentPage ? "active" : ""}" onclick="changePage(${page})">
                    ${page}
                </button>
            `
    }
  })

  paginationHTML += `
        </div>
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="sr-only">Next page</span>
        </button>
    `

  paginationControls.innerHTML = paginationHTML
}

function changePage(page) {
  const totalPages = Math.ceil(filteredResellers.length / itemsPerPage)

  if (page < 1 || page > totalPages || page === currentPage) return

  setLoadingState(true)

  setTimeout(() => {
    currentPage = page
    renderTable()
    renderPagination()
    setLoadingState(false)

    document.querySelector(".reseller-table-container").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, 200)
}

function updateStats() {
  const totalResellers = document.getElementById("totalResellers")

  if (totalResellers) {
    totalResellers.textContent = allResellers.length
  }
}

function createRippleEffect(event, element) {
  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(0, 255, 136, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `

  element.style.position = "relative"
  element.style.overflow = "hidden"
  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

function animateHamburger(button, isOpen) {
  const spans = button.querySelectorAll(".hamburger span")
  if (spans.length === 3) {
    if (isOpen) {
      spans[0].style.transform = "rotate(45deg) translate(6px, 6px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  }
}

function setLoadingState(loading) {
  const tableBody = document.getElementById("resellerTableBody")

  if (loading) {
    tableBody.style.opacity = "0.5"
    tableBody.style.pointerEvents = "none"
  } else {
    tableBody.style.opacity = "1"
    tableBody.style.pointerEvents = "auto"
  }
}

function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true
    button.style.opacity = "0.7"
    const originalText = button.innerHTML
    button.setAttribute("data-original-text", originalText)
    button.innerHTML = `
            <svg class="btn-icon animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Processing...
        `
  } else {
    button.disabled = false
    button.style.opacity = "1"
    const originalText = button.getAttribute("data-original-text")
    if (originalText) {
      button.innerHTML = originalText
    }
  }
}

function clearApplyForm() {
  document.getElementById("discordUsername").value = ""
  document.getElementById("experience").value = "beginner"
  document.getElementById("motivation").value = ""
}

function clearReportForm() {
  document.getElementById("reportSoftwareName").value = ""
  document.getElementById("resellerName").value = ""
  document.getElementById("resellerLink").value = ""
  document.getElementById("reportType").value = ""
  document.getElementById("reportReason").value = ""
  document.getElementById("reportDiscordUsername").value = ""

  const firstRadio = document.querySelector('input[name="softwareType"]')
  if (firstRadio) firstRadio.checked = true
}

function clearRequestForm() {
  document.getElementById("requestSoftwareName").value = ""
  document.getElementById("requestDescription").value = ""
  document.getElementById("requestPriority").value = "medium"

  const firstRadio = document.querySelector('input[name="requestSoftwareType"]')
  if (firstRadio) firstRadio.checked = true
}

function setupIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll(".reseller-row, .category-link, .stat-item").forEach((el) => {
    observer.observe(el)
  })
}

function initializeAnimations() {
  const style = document.createElement("style")
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .error-state {
            padding: 2rem;
            text-align: center;
        }
        
        .price-button.premium {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #1a1a1a;
            font-weight: 800;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
            animation: goldPulse 2s infinite;
        }
        
        .price-button.premium:hover {
            background: linear-gradient(135deg, #ffed4e, #ffd700);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
        }
    `
  document.head.appendChild(style)
}

function setupKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModals = document.querySelectorAll(".modal-overlay.show")
      openModals.forEach((modal) => hideModal(modal))

      const mobileMenu = document.getElementById("mobileMenuOverlay")
      if (mobileMenu?.classList.contains("show")) {
        mobileMenu.classList.remove("show")
        document.body.style.overflow = ""
        animateHamburger(document.getElementById("mobileMenuBtn"), false)
      }
    }

    if (e.key === "ArrowLeft" && e.ctrlKey) {
      e.preventDefault()
      if (currentPage > 1) changePage(currentPage - 1)
    }

    if (e.key === "ArrowRight" && e.ctrlKey) {
      e.preventDefault()
      const totalPages = Math.ceil(filteredResellers.length / itemsPerPage)
      if (currentPage < totalPages) changePage(currentPage + 1)
    }
  })
}

window.changePage = changePage
window.handlePriceClick = handlePriceClick
window.refreshData = refreshData
