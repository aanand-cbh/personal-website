"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu"

interface MenuItem {
  title: string
  items: { title: string; href: string }[]
}

interface FloatingNavigationMenuProps extends React.ComponentPropsWithoutRef<typeof NavigationMenu> {
  className?: string
  menuItems: MenuItem[]
}

export function FloatingNavigationMenu({ className, menuItems, ...props }: FloatingNavigationMenuProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  // Hamburger button for mobile
  const Hamburger = (
    <button
      className="fixed top-16 right-8 z-50 p-2 rounded-md bg-background border border-border sm:hidden"
      aria-label="Open navigation menu"
      onClick={() => setDrawerOpen(true)}
    >
      <span className="sr-only">Open navigation menu</span>
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  )

  // Drawer for mobile
  const Drawer = (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDrawerOpen(false)}
      />
      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-4/5 max-w-xs bg-background z-50 shadow-lg transform transition-transform duration-300 flex flex-col",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          className="self-end m-4 p-2 rounded-md bg-muted text-2xl"
          aria-label="Close navigation menu"
          onClick={() => setDrawerOpen(false)}
        >
          &times;
        </button>
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="font-semibold mb-2">{item.title}</div>
              <ul className="space-y-1">
                {item.items.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <a
                      href={subItem.href}
                      className="block px-2 py-1 rounded hover:bg-accent"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {subItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile: Hamburger and Drawer */}
      <div className="sm:hidden">
        {Hamburger}
        {Drawer}
      </div>
      {/* Desktop: Floating menu */}
      <div
        className={cn(
          "hidden sm:block fixed z-50 top-16 right-4 lg:right-8 xl:right-16 w-[400px]",
          className
        )}
      >
        <NavigationMenu {...props}>
          <NavigationMenuList className="list-none flex flex-row">
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index} className="list-none">
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-0.5 p-0 w-[400px] max-h-64 overflow-y-auto list-none">
                    {item.items.map((subItem, subIndex) => (
                      <li key={subIndex} className="m-0 p-0">
                        <NavigationMenuLink
                          href={subItem.href}
                          className="m-0 p-0 leading-snug text-sm"
                        >
                          {subItem.title}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  )
} 