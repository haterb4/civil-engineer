import Sidebar from '@/components/home/Sidebar';
import React from 'react'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <div className='flex h-screen w-full bg-gray-100'>
            {/* Sidebar */}
            <Sidebar />
            <div className='flex-1 p-10 bg-gray-100 h-screen overflow-hidden'>
                <div className='w-full h-full overflow-x-auto'>{children}</div>
            </div>
        </div>
    )
}
