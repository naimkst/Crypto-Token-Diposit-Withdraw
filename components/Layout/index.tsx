import React, { Children } from 'react'
import Sidebar from '../Sidebar'

export default function Layout({ children }: any) {
  return (
    <>
      <div className="flex flex-no-wrap">
            {/* Sidebar starts */}
            <Sidebar/>
            {/* Sidebar ends */}
            {/* Remove class [ h-64 ] when adding a card block */}
            <div className="container mx-auto py-10 md:w-4/5 w-11/12 px-6">
                {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
                <div className="w-full h-full rounded border-dashed border-2 border-gray-300 p-10">{children}</div>
            </div>
        </div>
    </>
  )
}
