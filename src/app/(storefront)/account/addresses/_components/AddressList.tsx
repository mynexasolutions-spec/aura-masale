'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin, CheckCircle } from 'lucide-react'
import { AddressForm } from './AddressForm'
import { deleteAddress, setDefaultAddress } from '@/actions/addresses'

type Address = {
  id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

export function AddressList({ addresses }: { addresses: Address[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    setLoadingId(id)
    await deleteAddress(id)
    setLoadingId(null)
  }

  const handleSetDefault = async (id: string) => {
    setLoadingId(id)
    await setDefaultAddress(id)
    setLoadingId(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Saved Addresses</h1>
          <p className="text-sm text-text-muted mt-1">Manage your shipping addresses.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-surface-dark/50 rounded-2xl border border-border border-dashed">
          <MapPin className="mx-auto h-12 w-12 text-text-muted opacity-50 mb-3" />
          <h3 className="text-sm font-medium text-text">No addresses found</h3>
          <p className="mt-1 text-sm text-text-muted">You haven't saved any shipping addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                address.is_default 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border bg-white hover:border-primary/30'
              }`}
            >
              {address.is_default && (
                <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Default
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-base font-bold text-text flex items-center justify-between">
                  {address.full_name}
                </h3>
                <p className="text-sm text-text-muted mt-1">{address.phone}</p>
                
                <div className="mt-4 text-sm text-text leading-relaxed">
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>India</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingAddress(address)}
                    disabled={loadingId === address.id}
                    className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface-dark"
                    title="Edit Address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={loadingId === address.id}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={loadingId === address.id}
                    className="text-sm font-medium text-primary hover:text-primary-light transition-colors disabled:opacity-50"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(isAdding || editingAddress) && (
        <AddressForm 
          address={editingAddress} 
          onClose={() => {
            setIsAdding(false)
            setEditingAddress(null)
          }} 
        />
      )}
    </div>
  )
}
