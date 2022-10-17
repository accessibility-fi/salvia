import React from 'react'
import { isEmpty } from 'rambda'
import { useTranslation } from 'react-i18next'
import { Label, Button } from 'suomifi-ui-components'

const FileUploader = ({
  onFileSelect,
  ext,
  label,
}: {
  onFileSelect: (file: File) => void
  ext?: string
  label?: string
}) => {
  const fileInput = React.useRef<HTMLInputElement>(null)
  const [translate] = useTranslation()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFileSelect(e.target.files[0])
  }

  return (
    <div className='salvia-file-uploader'>
      {!isEmpty(label) && <Label className='salvia-label'>{label}</Label>}
      <Button
        className='salvia-button'
        onClick={(_e) => fileInput.current && fileInput.current.click()}
      >
        {translate('salvia.upload')}
      </Button>
      <input
        type='file'
        style={{ display: 'none' }}
        accept={ext}
        ref={fileInput}
        onChange={handleFileInput}
      />
    </div>
  )
}

export default FileUploader
