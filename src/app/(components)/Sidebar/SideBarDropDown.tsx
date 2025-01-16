import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SideBarDropdownProps {
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean;
    children: React.ReactNode;
    href?: string
}

const SideBarDropDown = ({ 
    icon: Icon, 
    label, 
    isCollapsed, 
    children, 
    href="" 
}: SideBarDropdownProps) => {
    const pathname = usePathname();
    const isActive = href && pathname.startsWith(href);

    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div>
            {/* Parent Menu */}
            <div
                onClick={toggleDropdown}
                className={`cursor-pointer flex items-center ${
                isCollapsed ? 'justify-center py-4' : 'justify-start px-8 py-4'
                } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
                    isActive ? "text-white bg-blue-200" : ""
                }`}
            >
                <Icon className="w-6 h-6 !text-gray-700" />
                <span className={`${isCollapsed ? 'hidden' : 'block'} font-medium text-gray-700`}>{label}</span>
                {!isCollapsed && (
                <span className="ml-auto">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
                )}
            </div>
    
            {/* Submenu */}
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px', // Animate height
                }}
            >
                {!isCollapsed && <div className="pl-5">{children}</div>}
            </div>
        </div>
    );
};

export default SideBarDropDown;