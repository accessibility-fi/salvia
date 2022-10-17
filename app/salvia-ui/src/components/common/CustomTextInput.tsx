import { ChangeEvent } from 'react'
import styled from 'styled-components'
import {
  HintText,
  Label,
  TextInputProps,
  suomifiDesignTokens,
  StatusText,
} from 'suomifi-ui-components'
import { accentTertiaryLight3 } from '../../types/constants'

const PrependContainer = styled.div`
  display: flex;
  align-items: center;
`

const Input = styled.input`
  max-width: 100%;
  padding: 8px 16px;
  border: 1px solid ${suomifiDesignTokens.colors.depthLight1};
  border-radius: 2px;
  line-height: 1;
  background-color: hsl(0, 0%, 100%);
  min-width: 40px;
  width: 100%;
  min-height: 40px;
  padding-left: 10px;
  border-color: hsl(201, 7%, 58%);
  color: hsl(0, 0%, 16%);
  font-size: 16px;
  margin-left: -1px;

  &:focus {
    background-color: ${accentTertiaryLight3};
    box-shadow: 0 0 0 2px hsl(196deg 77% 44%);
    outline: none;
  }
`

const Prepend = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  border: 1px solid ${suomifiDesignTokens.colors.depthLight1};
  border-radius: 2px;
  border-color: hsl(201, 7%, 58%);
  background-color: ${accentTertiaryLight3};
  min-height: 40px;
  padding: 6px 10px;
  font-size: 16px;
`

const CustomTextInput = (props: TextInputProps & { prepend?: string }) => {
  const { id, prepend, labelText, hintText, value, onChange, statusText, ...rest } = props
  const inputId = id ?? 'custom-input'
  const hintId = inputId + '-tooltip'

  return (
    <>
      <div className='custom-text-input'>
        <Label htmlFor={inputId} style={{ display: 'block', marginBottom: '10px' }}>
          {labelText}
        </Label>
        {hintText && (
          <HintText id={hintId} style={{ marginBottom: '10px' }}>
            {hintText}
          </HintText>
        )}
        <PrependContainer>
          <Prepend>
            <span>{prepend}</span>
          </Prepend>
          <Input
            {...rest}
            id={inputId}
            className='fi-text-input_input'
            type='text'
            aria-describedby={hintId}
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (onChange) onChange(event.target.value)
            }}
          />
        </PrependContainer>
        {statusText && value && <StatusText>{statusText}</StatusText>}
      </div>
    </>
  )
}

export default CustomTextInput
