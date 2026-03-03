import React, { useRef } from 'react'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { useTheme } from '../../components/Settings/themeUtils'

// Import PrimeReact CSS
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

function NewPopUp() {
  const { theme, themeUtils } = useTheme()
  // Create refs for different toast positions
  const toast = useRef(null)
  const toastTL = useRef(null)
  const toastBL = useRef(null)
  const toastBR = useRef(null)
  const toastBC = useRef(null)
  const toastTC = useRef(null)

  // Success Toast
  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Your operation completed successfully!',
      life: 3000
    })
  }

  // Info Toast
  const showInfo = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Info Message',
      detail: 'Here is some important information for you.',
      life: 3000
    })
  }

  // Warning Toast
  const showWarn = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Warning Message',
      detail: 'Please be careful! This action requires attention.',
      life: 3000
    })
  }

  // Error Toast
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error Message',
      detail: 'Something went wrong. Please try again.',
      life: 3000
    })
  }

  // Multiple Toasts
  const showMultiple = () => {
    toast.current.show([
      { severity: 'info', summary: 'Message 1', detail: 'First notification', life: 3000 },
      { severity: 'success', summary: 'Message 2', detail: 'Second notification', life: 3000 },
      { severity: 'warn', summary: 'Message 3', detail: 'Third notification', life: 3000 }
    ])
  }

  // Sticky Toast (doesn't auto close)
  const showSticky = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Sticky Message',
      detail: 'This message will stay until you close it manually.',
      sticky: true
    })
  }

  // Custom Life Duration
  const showCustomLife = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Custom Duration',
      detail: 'This message will stay for 5 seconds.',
      life: 5000
    })
  }

  // Toast with custom content
  const showCustomContent = () => {
    toast.current.show({
      severity: 'success',
      summary: 'File Uploaded',
      detail: 'document.pdf has been uploaded successfully.',
      life: 4000,
      icon: 'pi pi-upload'
    })
  }

  // Clear all toasts
  const clearAll = () => {
    toast.current.clear()
  }

  // Position specific toasts
  const showTopLeft = () => {
    toastTL.current.show({
      severity: 'info',
      summary: 'Top Left',
      detail: 'This toast appears in top-left corner',
      life: 3000
    })
  }

  const showBottomLeft = () => {
    toastBL.current.show({
      severity: 'warn',
      summary: 'Bottom Left',
      detail: 'This toast appears in bottom-left corner',
      life: 3000
    })
  }

  const showBottomRight = () => {
    toastBR.current.show({
      severity: 'success',
      summary: 'Bottom Right',
      detail: 'This toast appears in bottom-right corner',
      life: 3000
    })
  }

  const showBottomCenter = () => {
    toastBC.current.show({
      severity: 'error',
      summary: 'Bottom Center',
      detail: 'This toast appears in bottom-center',
      life: 3000
    })
  }

  const showTopCenter = () => {
    toastTC.current.show({
      severity: 'info',
      summary: 'Top Center',
      detail: 'This toast appears in top-center',
      life: 3000
    })
  }

  // Real-world examples
  const showLoginSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Login Successful',
      detail: 'Welcome back, John Doe!',
      life: 3000,
      icon: 'pi pi-user'
    })
  }

  const showSaveData = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Data Saved',
      detail: 'Your changes have been saved successfully.',
      life: 3000,
      icon: 'pi pi-check-circle'
    })
  }

  const showDeleteConfirm = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Item Deleted',
      detail: 'The selected item has been removed.',
      life: 3000,
      icon: 'pi pi-trash'
    })
  }

  const showNetworkError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Network Error',
      detail: 'Unable to connect to server. Please check your connection.',
      life: 4000,
      icon: 'pi pi-wifi'
    })
  }

  const showFileUpload = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Uploading File',
      detail: 'Please wait while we upload your file...',
      life: 3000,
      icon: 'pi pi-cloud-upload'
    })
  }

  const showFormValidation = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Validation Failed',
      detail: 'Please fill all required fields correctly.',
      life: 3000,
      icon: 'pi pi-exclamation-triangle'
    })
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: themeUtils.getBgColor() }}>
      {/* Toast Components */}
      <Toast ref={toast} />
      <Toast ref={toastTL} position="top-left" />
      <Toast ref={toastBL} position="bottom-left" />
      <Toast ref={toastBR} position="bottom-right" />
      <Toast ref={toastBC} position="bottom-center" />
      <Toast ref={toastTC} position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: themeUtils.getTextColor(true) }}>
            PrimeReact Toast Messages
          </h1>
          <p className="text-lg" style={{ color: themeUtils.getTextColor(false) }}>
            Complete showcase of all toast notification types and positions
          </p>
        </div>

        {/* Basic Toast Types */}
        <div className="rounded-2xl shadow-2xl p-8 mb-8" style={{ backgroundColor: themeUtils.getBgColor('card') }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold pb-3 border-b-2" style={{ color: themeUtils.getTextColor(true), borderColor: theme.headerBg }}>
              📢 Basic Toast Types
            </h2>
            <Button
              label="Clear All"
              icon="pi pi-times"
              className="p-button-danger p-button-sm"
              onClick={clearAll}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              label="Success"
              icon="pi pi-check"
              className="p-button-success"
              style={{ height: '48px' }}
              onClick={showSuccess}
            />

            <Button
              label="Info"
              icon="pi pi-info-circle"
              className="p-button-info"
              style={{ height: '48px' }}
              onClick={showInfo}
            />

            <Button
              label="Warning"
              icon="pi pi-exclamation-triangle"
              className="p-button-warning"
              style={{ height: '48px' }}
              onClick={showWarn}
            />

            <Button
              label="Error"
              icon="pi pi-times-circle"
              className="p-button-danger"
              style={{ height: '48px' }}
              onClick={showError}
            />
          </div>
        </div>

        {/* Advanced Toast Features */}
        <div className="rounded-2xl shadow-2xl p-8 mb-8" style={{ backgroundColor: themeUtils.getBgColor('card') }}>
          <h2 className="text-2xl font-semibold mb-6 pb-3 border-b-2" style={{ color: themeUtils.getTextColor(true), borderColor: theme.headerBg }}>
            ⚡ Advanced Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              label="Multiple Toasts"
              icon="pi pi-list"
              className="p-button-secondary"
              style={{ height: '48px' }}
              onClick={showMultiple}
            />

            <Button
              label="Sticky Toast"
              icon="pi pi-thumbtack"
              className="p-button-help"
              style={{ height: '48px' }}
              onClick={showSticky}
            />

            <Button
              label="Custom Duration"
              icon="pi pi-clock"
              className="p-button-secondary"
              style={{ height: '48px' }}
              onClick={showCustomLife}
            />

            <Button
              label="Custom Content"
              icon="pi pi-star"
              className="p-button-secondary"
              style={{ height: '48px' }}
              onClick={showCustomContent}
            />
          </div>
        </div>

        {/* Toast Positions */}
        <div className="rounded-2xl shadow-2xl p-8 mb-8" style={{ backgroundColor: themeUtils.getBgColor('card') }}>
          <h2 className="text-2xl font-semibold mb-6 pb-3 border-b-2" style={{ color: themeUtils.getTextColor(true), borderColor: theme.headerBg }}>
            📍 Toast Positions
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button
              label="Top Left"
              icon="pi pi-arrow-up-left"
              className="p-button-outlined"
              style={{ height: '48px' }}
              onClick={showTopLeft}
            />

            <Button
              label="Top Center"
              icon="pi pi-arrow-up"
              className="p-button-outlined"
              style={{ height: '48px' }}
              onClick={showTopCenter}
            />

            <Button
              label="Top Right (Default)"
              icon="pi pi-arrow-up-right"
              className="p-button-outlined p-button-info"
              style={{ height: '48px' }}
              onClick={showSuccess}
            />

            <Button
              label="Bottom Left"
              icon="pi pi-arrow-down-left"
              className="p-button-outlined"
              style={{ height: '48px' }}
              onClick={showBottomLeft}
            />

            <Button
              label="Bottom Center"
              icon="pi pi-arrow-down"
              className="p-button-outlined"
              style={{ height: '48px' }}
              onClick={showBottomCenter}
            />

            <Button
              label="Bottom Right"
              icon="pi pi-arrow-down-right"
              className="p-button-outlined"
              style={{ height: '48px' }}
              onClick={showBottomRight}
            />
          </div>
        </div>

        {/* Real-world Use Cases */}
        <div className="rounded-2xl shadow-2xl p-8 mb-8" style={{ backgroundColor: themeUtils.getBgColor('card') }}>
          <h2 className="text-2xl font-semibold mb-6 pb-3 border-b-2" style={{ color: themeUtils.getTextColor(true), borderColor: theme.headerBg }}>
            🌟 Real-world Examples
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-2 rounded-lg p-4 hover:opacity-90 transition-colors" style={{ borderColor: themeUtils.getBorderColor(), backgroundColor: themeUtils.getBgColor('hover') }}>
              <h3 className="font-semibold mb-2 flex items-center" style={{ color: themeUtils.getTextColor(true) }}>
                <i className="mr-2" style={{ color: theme.headerBg }}>pi pi-user</i>
                User Actions
              </h3>
              <div className="space-y-2">
                <Button
                  label="Login Success"
                  icon="pi pi-sign-in"
                  className="p-button-success p-button-sm w-full"
                  onClick={showLoginSuccess}
                />
                <Button
                  label="Save Data"
                  icon="pi pi-save"
                  className="p-button-success p-button-sm w-full"
                  onClick={showSaveData}
                />
              </div>
            </div>

            <div className="border-2 rounded-lg p-4 hover:opacity-90 transition-colors" style={{ borderColor: themeUtils.getBorderColor(), backgroundColor: themeUtils.getBgColor('hover') }}>
              <h3 className="font-semibold mb-2 flex items-center" style={{ color: themeUtils.getTextColor(true) }}>
                <i className="mr-2" style={{ color: theme.headerBg }}>pi pi-exclamation-triangle</i>
                Warnings
              </h3>
              <div className="space-y-2">
                <Button
                  label="Delete Item"
                  icon="pi pi-trash"
                  className="p-button-warning p-button-sm w-full"
                  onClick={showDeleteConfirm}
                />
                <Button
                  label="Form Validation"
                  icon="pi pi-exclamation-circle"
                  className="p-button-warning p-button-sm w-full"
                  onClick={showFormValidation}
                />
              </div>
            </div>

            <div className="border-2 rounded-lg p-4 hover:opacity-90 transition-colors" style={{ borderColor: themeUtils.getBorderColor(), backgroundColor: themeUtils.getBgColor('hover') }}>
              <h3 className="font-semibold mb-2 flex items-center" style={{ color: themeUtils.getTextColor(true) }}>
                <i className="mr-2" style={{ color: theme.headerBg }}>pi pi-times-circle</i>
                Errors
              </h3>
              <div className="space-y-2">
                <Button
                  label="Network Error"
                  icon="pi pi-wifi"
                  className="p-button-danger p-button-sm w-full"
                  onClick={showNetworkError}
                />
                <Button
                  label="Upload Failed"
                  icon="pi pi-cloud-upload"
                  className="p-button-danger p-button-sm w-full"
                  onClick={showFileUpload}
                />
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default NewPopUp