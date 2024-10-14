// import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import Greet from "../../src/components/Greet"
import '@testing-library/jest-dom/vitest'

describe('Greet', () => {
    it('should render Hello with the name when the name is provided', () => {
        render(<Greet name="Martin" />)
        const heading = screen.getByRole('heading')
        expect(heading).toBeInTheDocument()
    })
    it('should render login button when name is not provided', () => {
        render(<Greet />)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent(/login/i)
    })
})