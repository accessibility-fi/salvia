import { SalviaTest } from '../types/SalviaTest'
import SalviaTestCaseResult from './SalviaTestCaseResult'
import { Expander, ExpanderContent, ExpanderTitleButton } from 'suomifi-ui-components'

const SalviaTestResult = ({ id, domain, results }: SalviaTest) => {
  return (
    <>
      <Expander defaultOpen={false}>
        <ExpanderTitleButton asHeading='h3'>{domain}</ExpanderTitleButton>
        <ExpanderContent>
          <ul className='salvia-test-suit salvia-list'>
            {results.map((item) => (
              <li key={item.id}>
                <SalviaTestCaseResult domain={domain} salviaTestCase={item} />
              </li>
            ))}
          </ul>
        </ExpanderContent>
      </Expander>
    </>
  )
}

export default SalviaTestResult
