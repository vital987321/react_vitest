import { render, screen } from '@testing-library/react';
import { it, expect, describe, vi } from 'vitest'
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
    const renderComponent = () => {
        const onChange = vi.fn();
        const user = userEvent.setup();
        render(
          <Theme>
            <OrderStatusSelector onChange={onChange} />
          </Theme>
        );

        return {
          onChange,
          trigger: screen.getByRole("combobox"),
            user,
          getOptions: () => screen.findAllByRole("option"),
          getOption: (label)=> screen.getByRole("option", { name: label })
        };
    }

    it("should render New as the default value", () => {
        const { trigger } = renderComponent();
        expect(trigger).toHaveTextContent(/new/i)
    });

    it("should render correct statuses", async () => {
        const { trigger, user, getOptions } = renderComponent();
        await user.click(trigger)
        const options = await getOptions()
        expect(options).toHaveLength(3);
        const labels=options.map((option)=>option.textContent)
        expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
    });

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])("should call onChange with $value when $label option is selected", async ({ label, value }) => {
      const { trigger, onChange, user, getOption } = renderComponent();
      await user.click(trigger);
      const option = getOption(label );
      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(value);
  });
  
  it("should call onChange with 'new' when /new/i option is selected", async () => {
    const { trigger, onChange, user, getOption } = renderComponent();
    await user.click(trigger);
    const tempOption = getOption(/processed/i);
    await user.click(tempOption);
    await user.click(trigger);
    const option = getOption(/new/i);
    await user.click(option);
    expect(onChange).toHaveBeenCalledWith('new');
  })
})

