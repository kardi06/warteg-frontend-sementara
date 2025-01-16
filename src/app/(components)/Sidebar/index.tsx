'use client';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSideBarCollapsed } from '@/state';
import { 
    BadgeDollarSign,
    Clipboard, 
    Layout, 
    ListCheck, 
    LucideIcon, 
    Menu, 
    Salad, 
    ShoppingBag,
    Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import SideBarDropDown from './SideBarDropDown';
import Image from 'next/image';

interface SideBarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean
}

const SideBarLink = ({
    href,
    icon: Icon,
    label,
    isCollapsed   
}: SideBarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === '/' && href === '/dashboard');

    return (
        <Link href={href}>
            <div className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"} hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${isActive ? "text-white bg-blue-200" : ""}`}>
                <Icon className='w-6 h-6 !text-gray-700'/>
                <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>
                    {label}
                </span>
            </div>
        </Link>
    );
}

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isSideBarCollapsed = useAppSelector(state => state.global.isSidebarCollapsed);

    const toogleSidebar = () => {
        dispatch(setIsSideBarCollapsed(!isSideBarCollapsed));
    }

    const sidebarClassNames = `fixed flex flex-col ${isSideBarCollapsed ? "w-0": "w-72 md:w-64"} 
    bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
        {/* TOP LOGO */}
        <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSideBarCollapsed ? "px-5" : "px-8"}`}>
            <Image src="/logo-1.png" alt="WartegApps Logo" width={30} height={50}/>
            <h1 className={`${isSideBarCollapsed ? "hidden" : "block"} font-extrabold text-2xl`}>WartegApps</h1>
            <button className='md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100' onClick={toogleSidebar}>
                <Menu className='w-4 h-4' size={24}/>
            </button>
        </div>
        {/* LINK */}
        <div className='flex-grow mt-8'>
            <SideBarLink
                href='/dashboard'
                icon={Layout}
                label='Dashboard'
                isCollapsed={isSideBarCollapsed}
            />
            {/* Dropdown Menu */}
            <SideBarDropDown 
                icon={Clipboard} 
                label="Master" 
                isCollapsed={isSideBarCollapsed}
                href="/master"
            >
                    <SideBarLink 
                        href="/master/category" 
                        icon={ListCheck} 
                        label="Kategori" 
                        isCollapsed={false} />
                    <SideBarLink 
                        href="/master/bahanbaku" 
                        icon={Salad} 
                        label="Bahan Baku" 
                        isCollapsed={false} />
                    <SideBarLink 
                        href="/master/products" 
                        icon={Utensils} 
                        label="Produk" 
                        isCollapsed={false} />
            </SideBarDropDown>
            <SideBarLink
                href='/belanja'
                icon={ShoppingBag}
                label='Belanja'
                isCollapsed={isSideBarCollapsed}
            />
            <SideBarLink
                href='/penjualan'
                icon={BadgeDollarSign}
                label='Penjualan'
                isCollapsed={isSideBarCollapsed}
            />
        </div>
        {/* Footer */}
        <div className={`${isSideBarCollapsed ? "hidden" : "block"} mb-10`}>
            <p className='text-center text-xs text-gray-500'>&copy; 2025 WartegApps</p>
        </div>
    </div>
  )
}

export default Sidebar