import type { ComponentType } from "react"
import { useEffect, useState } from "react"

/**
 * Navigation background: transparent at the top of the page,
 * frosted (blurred, slightly dark) once the page is scrolled.
 */
export function withScrollBlur(Component: any): ComponentType {
    return (props: any) => {
        const [scrolled, setScrolled] = useState(false)

        useEffect(() => {
            // only the home page starts with a transparent bar (dark hero underneath)
            const onScroll = () => setScrolled(window.location.pathname !== "/" || window.scrollY > 24)
            onScroll()
            window.addEventListener("scroll", onScroll, { passive: true })
            return () => window.removeEventListener("scroll", onScroll)
        }, [])

        const blur = scrolled ? "blur(18px) saturate(140%)" : "blur(0px)"
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    backgroundColor: scrolled ? "rgba(14, 13, 12, 0.55)" : "rgba(14, 13, 12, 0)",
                    backdropFilter: blur,
                    WebkitBackdropFilter: blur,
                    boxShadow: scrolled ? "inset 0 -1px 0 rgba(246, 241, 233, 0.1)" : "inset 0 -1px 0 rgba(246, 241, 233, 0)",
                    transition: "background-color 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease, box-shadow 0.4s ease",
                }}
            />
        )
    }
}
