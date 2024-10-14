// import { it, expect, describe } from 'vitest'
import { render, screen } from "@testing-library/react"
import BrowseProducts from "../../src/pages/BrowseProductsPage"
import { expect } from "vitest"
import { Theme } from "@radix-ui/themes"

describe('BrowseProducts', () => {
    const renderComponent=()=>{
        render( 
            <Theme>
                <BrowseProducts/>
            </Theme>
        )
    }
    it('should render loading skeletons for categories', () => {
        renderComponent()
        const text = String.fromCodePoint('8204') // '&zwnj;'  &zwnj; or &#8204
        const allElements=screen.getAllByText(text, {selector: 'span'})
        
        expect(allElements[0]).toHaveClass('react-loading-skeleton')
        expect (allElements[0].parentNode.parentNode).toHaveClass('max-w-xs')
        
    })
})