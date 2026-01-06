import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {

  const links = [
    {
      href: "/guide",
      title: "Guide"
    },
    {
      href: "/pricing",
      title: "Pricing"
    },
    {
      href: "/login",
      title: "Login"
    },
  ]

  return (
    <div className="flex items-center justify-between w-4xl">
      <Link href="/">
        <Image draggable="false" src="/vercel.svg" width={50} height={50} alt="" />
      </Link>
      
      <div className="flex items-center gap-4">

        {links.map((link, idx) => <Link className="text-neutral-800 fint-medium hover:text-neutral-500 transition duration-200" href={link} key={idx}>
          {link.title}
        </Link> )}
      </div>
        
    </div>
  )
}