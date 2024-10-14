import { it, expect, describe } from 'vitest'
import ExpandableText from "../../src/components/ExpandableText"
import { render, screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event"

describe('ExpendableText', () => {
    const limit=255
    const shortText="a".repeat(250)
    const longText="b".repeat(257)
    const reducedText=longText.slice(0, limit)+"..."

    it('returns short text, no buttons', () => {
        render(<ExpandableText text={shortText}/>)
        const textElement=screen.getByText(shortText)
        expect(textElement).toBeInTheDocument()
        expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })
    it('returns reduced text and button', () => {
        render(<ExpandableText text={longText}/>)
        const button=screen.queryByRole("button")
        expect(button).toBeInTheDocument()
        const textElement=screen.getByText(reducedText)
        expect(textElement).toBeInTheDocument()
    })
    it('returns longText after button click', async () => {
        render(<ExpandableText text={longText}/>)
        const button=screen.queryByRole("button")
        expect(button).toBeInTheDocument()
        const user=userEvent.setup()
        await user.click(button)
        const textElement=screen.getByText(longText)
        expect(textElement).toBeInTheDocument()
    })
    it('returns reduced text on the second button click', async () => {
        render(<ExpandableText text={longText}/>)
        const button=screen.queryByRole("button")
        const user=userEvent.setup()
        await user.click(button)
        await user.click(button)
        const textElement=screen.getByText(reducedText)
        expect(textElement).toBeInTheDocument()


    })
})   