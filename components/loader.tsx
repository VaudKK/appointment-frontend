import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center min-h-screen items-center py-8">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
        </div>
    )
}
export default Loader
