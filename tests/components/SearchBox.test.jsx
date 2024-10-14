import { it, expect, describe } from 'vitest'
import SearchBox from '../../src/components/SearchBox'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('SearchBox', () => {
    const renderSearchBox = () => {
        const onChange = vi.fn()
        const user=userEvent.setup()
        render(<SearchBox onChange={onChange} />)
        const inputField = screen.getByPlaceholderText(/search/i);
        return {
          inputField,
          onChange,
          user,
        };
    }
    it('renders component', () => {
        render(<SearchBox/>)
        const input=screen.getByPlaceholderText(/search/i)
        expect (input).toBeInTheDocument()
    })
    it('calls onChange function on enter with text', async () => {
        const { inputField, onChange, user } = renderSearchBox()
        const searchText="SearchText"
        await user.type(inputField, searchText+'{Enter}')
        expect(inputField).toHaveValue(searchText)
        expect(onChange).toHaveBeenCalledOnce()
    })
    it('onChange is not called on enter if input is empty', async () => {
        const { inputField, onChange, user } = renderSearchBox();
        await user.type(inputField, "{Enter}");
        expect(inputField).toHaveValue('');
        expect(onChange).not.toHaveBeenCalled();
    })
    
})

