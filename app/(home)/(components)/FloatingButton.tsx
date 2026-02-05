import React from 'react'

const FloatingButton = () => {
    return (
        <div className='text-background text-h3'>
            <div className="flex items-center justify-center gap-4">
                <span className=' bg-red-500/90 px-4 py-2'>Prev</span>
                <span className='font-semibold bg-red-500/90 px-4 py-2'>Video Title</span>
                <span className=' bg-red-500/90 px-4 py-2'>Next</span>
            </div>
        </div>
    )
}

export default FloatingButton