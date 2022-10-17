import { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Localize from './common/Localize'
import FileUploader from './FileUploader'
import { formatDomain } from './utils'
import {
  Button,
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  TextInput,
} from 'suomifi-ui-components'
import { useTranslation } from 'react-i18next'
import urljoin from 'url-join'
import { isEmpty } from 'rambda'
import CustomTextInput from './common/CustomTextInput'

export type TestResult = {
  url: string
  file?: File
  filename?: string
  report?: any
  title?: string
  description?: string
  uniqueUrl?: string
}

const AddTestResult = ({
  domain,
  addTestResult,
}: {
  domain: string
  addTestResult: (testResult: TestResult) => void
}) => {
  const [selectedFile, setSelectedFile] = useState<File>()
  const [open, setOpen] = useState(false)
  const [url, setURL] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [translate] = useTranslation()

  const clear = () => {
    setURL('')
    setDescription('')
    setSelectedFile(undefined)
  }

  const buildURL = (url: string) => {
    return url.startsWith('http') ? url : urljoin(domain, url)
  }

  const add = (file: File) => {
    if (file) {
      const fileReader = new FileReader()
      fileReader.readAsText(file, 'UTF-8')
      fileReader.onload = (e) => {
        const json = e.target?.result
        if (json && typeof json === 'string') {
          const report = JSON.parse(json)

          const title = report['summary']['title']

          addTestResult({
            url: buildURL(url),
            filename: file.name,
            report: report,
            title: title,
            description: description,
          })

          setOpen(false)

          clear()
        }
      }
    }
  }

  return (
    <Expander
      open={open}
      onOpenChange={(open) => {
        setOpen(!open)
      }}
    >
      <ExpanderTitleButton asHeading='h3'>
        <Localize text='salvia.add-test-info' />
      </ExpanderTitleButton>
      <ExpanderContent>
        <Container className='salvia-testing-form' data-testid='salvia-testing-form'>
          <Row className='form-row'>
            <Col xs={12} lg={6}>
              <CustomTextInput
                id='add-test-page-url'
                labelText={translate('salvia.test-page-url')}
                hintText={translate('salvia.add-page-tooltip')}
                prepend={formatDomain(domain)}
                value={url}
                onChange={(value) => setURL(value?.toString() ?? '')}
              />
            </Col>
          </Row>

          <Row className='form-row'>
            <Col xs={12} lg={6}>
              <TextInput
                fullWidth
                labelText={translate('salvia.description')}
                value={description}
                onChange={(value) => setDescription(value?.toString() ?? '')}
                visualPlaceholder={translate('salvia.enter-description')}
                hintText={translate('salvia.description-tooltip')}
              />
            </Col>
          </Row>
          <Row className='form-row'>
            <Col xs={12} lg={6}>
              <div className='select-file-container'>
                {!selectedFile ? (
                  <FileUploader
                    onFileSelect={(file) => setSelectedFile(file)}
                    ext='.json'
                    label={translate('salvia.select-report')}
                  />
                ) : (
                  <>
                    <span>{selectedFile?.name}</span>
                    <Button
                      id='remove-selected-file'
                      className='salvia-button'
                      onClick={() => setSelectedFile(undefined)}
                    >
                      <Localize text='salvia.remove-file' />
                    </Button>
                  </>
                )}
              </div>

              <div>
                {selectedFile && (
                  <Button
                    id='salvia-add-test-result'
                    className='salvia-button'
                    disabled={!selectedFile || isEmpty(domain)}
                    onClick={() => add(selectedFile)}
                  >
                    <Localize text='salvia.add-page' />
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </ExpanderContent>
    </Expander>
  )
}

export default AddTestResult
