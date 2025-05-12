"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { QuillIcon } from "@/components/quill-icon"

export function SampleWillPopup() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-white underline hover:text-white/90 transition-colors">
        View a sample will
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <QuillIcon className="h-5 w-5 text-[#007BFF]" />
              Sample Will Preview
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="py-4 px-2">
            <div className="border rounded-md p-6 bg-white">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold">LAST WILL AND TESTAMENT</h2>
                <p className="text-sm my-1">of</p>
                <h3 className="text-lg font-bold border-b border-gray-300 pb-2">JOHN ROBERT SMITH</h3>
              </div>

              <section className="mb-6">
                <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">1. REVOCATION</h3>
                <p className="text-sm">
                  I, JOHN ROBERT SMITH, of 123 High Street, London, SW1A 1AA, REVOKE all former wills and testamentary
                  dispositions made by me and declare this to be my last Will.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">2. APPOINTMENT OF EXECUTORS</h3>
                <p className="text-sm mb-2">
                  I APPOINT my wife, JANE ELIZABETH SMITH, to be the Executor and Trustee of my Will.
                </p>
                <p className="text-sm">
                  If my wife is unable or unwilling to act as Executor, I APPOINT my brother, ROBERT JAMES SMITH, to be
                  the Executor and Trustee of my Will.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">3. SPECIFIC GIFTS</h3>
                <p className="text-sm mb-2">I GIVE my vintage watch collection to my son, THOMAS JOHN SMITH.</p>
                <p className="text-sm">
                  I GIVE the sum of Five Thousand Pounds (£5,000) to Cancer Research UK (registered charity number
                  1089464).
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">4. RESIDUARY ESTATE</h3>
                <p className="text-sm">
                  I GIVE all the residue of my estate, property and assets of whatever nature and wherever situated to
                  my wife, JANE ELIZABETH SMITH, absolutely.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">5. FUNERAL WISHES</h3>
                <p className="text-sm">
                  I wish to be cremated and have my ashes scattered in the garden of our family home.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-bold text-lg border-b border-gray-200 pb-1 mb-2">6. ATTESTATION</h3>
                <p className="text-sm mb-4">
                  IN WITNESS whereof I have hereunto set my hand to this my Will on the date written below.
                </p>

                <div className="border-t border-gray-300 pt-2 mt-8 mb-4">
                  <p className="text-sm">
                    Signed by the above named JOHN ROBERT SMITH as his last Will in our presence.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div>
                    <div className="border-t border-gray-300 pt-1 mb-1">
                      <p className="text-xs text-gray-500">Signature of Testator</p>
                    </div>
                    <p className="text-xs text-gray-500">Date: ________________</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div>
                    <div className="border-t border-gray-300 pt-1 mb-1">
                      <p className="text-xs text-gray-500">Signature of first witness</p>
                    </div>
                    <p className="text-xs text-gray-500">Name: ________________</p>
                    <p className="text-xs text-gray-500">Address: ________________</p>
                    <p className="text-xs text-gray-500">Occupation: ________________</p>
                  </div>
                  <div>
                    <div className="border-t border-gray-300 pt-1 mb-1">
                      <p className="text-xs text-gray-500">Signature of second witness</p>
                    </div>
                    <p className="text-xs text-gray-500">Name: ________________</p>
                    <p className="text-xs text-gray-500">Address: ________________</p>
                    <p className="text-xs text-gray-500">Occupation: ________________</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 border-t pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
