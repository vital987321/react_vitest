import { it, expect, describe } from 'vitest'
import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";
// import { vi } from "vitest";
// import viteReact from "@vitejs/plugin-react";

describe('ProductImageGalery', () => {
    it('returns empty DOM if called with empty array', () => {
        const {container} = render(<ProductImageGallery imageUrls={[]}/>)
        expect(container).toBeEmptyDOMElement()
    })
    it('returns ', () => {
        const imageUrls=['url1', 'url2']
        render(<ProductImageGallery imageUrls={imageUrls}/>)
        const images=screen.getAllByRole("img")
        expect(images).toHaveLength(2)
        images.forEach((img, index)=>{
            expect(img).toHaveAttribute('src', imageUrls[index])
        })
    })
})