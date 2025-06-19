"use client"

import { useCallback } from "react"

interface ExportOptions {
  elementId: string
  filename: string
}

// Helper function to find chart element with multiple strategies
const findChartElement = async (elementId: string): Promise<HTMLElement | null> => {
  console.log("Looking for chart element with ID:", elementId)

  // Strategy 1: Direct ID lookup
  let element = document.getElementById(elementId)
  if (element) {
    console.log("Found element with direct ID lookup")
    return element
  }

  // Strategy 2: Wait a bit and try again
  await new Promise((resolve) => setTimeout(resolve, 500))
  element = document.getElementById(elementId)
  if (element) {
    console.log("Found element after waiting")
    return element
  }

  // Strategy 3: Look for elements with data-chart-id
  element = document.querySelector(`[data-chart-id="${elementId}"]`) as HTMLElement
  if (element) {
    console.log("Found element with data-chart-id")
    return element
  }

  // Strategy 4: Look for chart containers
  const chartContainers = document.querySelectorAll(".recharts-wrapper")
  console.log("Found chart containers:", chartContainers.length)

  for (let i = 0; i < chartContainers.length; i++) {
    const container = chartContainers[i] as HTMLElement
    const parent = container.closest("[id]") as HTMLElement
    if (parent && parent.id.includes(elementId.split("-")[0])) {
      console.log("Found chart by container matching")
      return parent
    }
  }

  // Strategy 5: Just use the first chart container as a fallback
  if (chartContainers.length > 0) {
    const firstContainer = chartContainers[0] as HTMLElement
    const parent = firstContainer.closest(".chart-container") as HTMLElement
    if (parent) {
      console.log("Using first chart container as fallback")
      return parent
    }
    return firstContainer
  }

  console.error("Could not find chart element with any strategy")
  return null
}

// Pure browser-based image generation using html2canvas-like approach
const generateImageFromElement = async (
  element: HTMLElement,
  format: "png" | "jpeg",
  quality = 1.0,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Canvas context not available")
      }

      // Set canvas size with higher resolution
      const scale = 2
      canvas.width = element.offsetWidth * scale
      canvas.height = element.offsetHeight * scale
      ctx.scale(scale, scale)

      // Fill white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, element.offsetWidth, element.offsetHeight)

      // Get SVG element
      const svgElement = element.querySelector("svg")
      if (!svgElement) {
        throw new Error("SVG element not found")
      }

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, element.offsetWidth, element.offsetHeight)

          const dataUrl = format === "jpeg" ? canvas.toDataURL("image/jpeg", quality) : canvas.toDataURL("image/png")

          URL.revokeObjectURL(url)
          resolve(dataUrl)
        } catch (error) {
          URL.revokeObjectURL(url)
          reject(error)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error("Failed to load SVG image"))
      }

      img.src = url
    } catch (error) {
      reject(error)
    }
  })
}

export function useChartExport() {
  const downloadSVG = useCallback(async ({ elementId, filename }: ExportOptions) => {
    try {
      console.log("Starting SVG download for:", elementId)

      const chartElement = await findChartElement(elementId)
      if (!chartElement) {
        alert("Chart not found. Please wait for the chart to load completely and try again.")
        return
      }

      // Look for SVG with multiple strategies
      let svgElement = chartElement.querySelector("svg")
      if (!svgElement) {
        svgElement = chartElement.querySelector(".recharts-wrapper svg")
      }
      if (!svgElement) {
        svgElement = document.querySelector(".recharts-wrapper svg")
      }

      if (!svgElement) {
        alert("Chart SVG not found. Please ensure the chart is fully loaded and try again.")
        return
      }

      console.log("SVG element found, proceeding with download")

      // Clone and prepare SVG
      const svgClone = svgElement.cloneNode(true) as SVGElement
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg")

      // Get computed styles and apply them
      const svgRect = svgElement.getBoundingClientRect()
      svgClone.setAttribute("width", svgRect.width.toString())
      svgClone.setAttribute("height", svgRect.height.toString())

      const svgData = new XMLSerializer().serializeToString(svgClone)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const downloadLink = document.createElement("a")
      downloadLink.href = svgUrl
      downloadLink.download = `${filename}.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(svgUrl)

      console.log("SVG download completed successfully")
    } catch (error) {
      console.error("Error downloading SVG:", error)
      alert("Failed to download SVG. Please try again.")
    }
  }, [])

  const downloadPNG = useCallback(async ({ elementId, filename }: ExportOptions) => {
    try {
      console.log("Starting PNG download for:", elementId)

      const chartElement = await findChartElement(elementId)
      if (!chartElement) {
        alert("Chart not found. Please wait for the chart to load completely and try again.")
        return
      }

      console.log("Chart element found, generating PNG...")

      // Use our pure browser-based approach
      const dataUrl = await generateImageFromElement(chartElement, "png", 1.0)

      // Convert data URL to blob and download
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      const downloadUrl = URL.createObjectURL(blob)
      const downloadLink = document.createElement("a")
      downloadLink.href = downloadUrl
      downloadLink.download = `${filename}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(downloadUrl)

      console.log("PNG download completed successfully")
    } catch (error) {
      console.error("Error downloading PNG:", error)
      alert("Failed to download PNG. Please try SVG download instead.")
    }
  }, [])

  const downloadJPEG = useCallback(async ({ elementId, filename }: ExportOptions) => {
    try {
      console.log("Starting JPEG download for:", elementId)

      const chartElement = await findChartElement(elementId)
      if (!chartElement) {
        alert("Chart not found. Please wait for the chart to load completely and try again.")
        return
      }

      console.log("Chart element found, generating JPEG...")

      // Use our pure browser-based approach
      const dataUrl = await generateImageFromElement(chartElement, "jpeg", 0.95)

      // Convert data URL to blob and download
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      const downloadUrl = URL.createObjectURL(blob)
      const downloadLink = document.createElement("a")
      downloadLink.href = downloadUrl
      downloadLink.download = `${filename}.jpg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(downloadUrl)

      console.log("JPEG download completed successfully")
    } catch (error) {
      console.error("Error downloading JPEG:", error)
      alert("Failed to download JPEG. Please try SVG download instead.")
    }
  }, [])

  const printChart = useCallback(async ({ elementId }: { elementId: string }) => {
    try {
      console.log("Starting print for:", elementId)

      const chartElement = await findChartElement(elementId)
      if (!chartElement) {
        alert("Chart not found. Please wait for the chart to load completely and try again.")
        return
      }

      const printWindow = window.open("", "_blank", "width=800,height=600")
      if (!printWindow) {
        alert("Popup blocked. Please allow popups for this site and try again.")
        return
      }

      const chartHTML = chartElement.outerHTML

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Government Chart Report</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
                background: white;
              }
              @media print { 
                body { margin: 0; padding: 10px; } 
                * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
              }
              svg { max-width: 100%; height: auto; }
              .recharts-wrapper { background: white !important; }
              .min-h-\\[300px\\] { min-height: auto !important; }
            </style>
          </head>
          <body>
            <div style="text-align: center; margin-bottom: 20px;">
              <h2>Government Chart Report</h2>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            ${chartHTML}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                }, 1000);
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
      console.log("Print initiated successfully")
    } catch (error) {
      console.error("Error printing chart:", error)
      alert("Failed to print chart. Please try again.")
    }
  }, [])

  const viewFullscreen = useCallback(async ({ elementId }: { elementId: string }) => {
    try {
      console.log("Toggling fullscreen for:", elementId)

      const chartElement = await findChartElement(elementId)
      if (!chartElement) {
        alert("Chart not found. Please wait for the chart to load completely and try again.")
        return
      }

      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error("Error exiting fullscreen:", err)
        })
      } else {
        const requestFullscreen =
          chartElement.requestFullscreen ||
          (chartElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen ||
          (chartElement as HTMLElement & { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen ||
          (chartElement as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen

        if (requestFullscreen) {
          requestFullscreen.call(chartElement).catch((err: Error) => {
            console.error("Error entering fullscreen:", err)
            alert("Fullscreen mode not available. Please try pressing F11 manually.")
          })
        } else {
          alert("Fullscreen not supported in your browser.")
        }
      }
      console.log("Fullscreen operation completed")
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
      alert("Failed to toggle fullscreen. Please try again.")
    }
  }, [])

  return {
    downloadSVG,
    downloadPNG,
    downloadJPEG,
    printChart,
    viewFullscreen,
  }
}
