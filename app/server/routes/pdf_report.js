'use strict'

const PDFDocument = require('pdfkit')
const i18n = require('i18n')
const { DateTime } = require('luxon')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const { translate, formatDateTime, formatLang, formatURL_TR } = require('./utils.js')

//custom list options
const bulletRadius = 3
const options = { bulletRadius: bulletRadius, textIndent: bulletRadius * 5 }

function createJSONPDF(res, jsonReport, lang) {
  const locale = formatLang(lang) || 'en'

  i18n.setLocale(locale)

  const report = JSON.stringify(
    jsonReport.data,
    (key, value) => {
      if (key === 'dom') return {}
      return value
    },
    2,
  )

  try {
    const doc = new PDFDocument()
    res.setHeader('Content-type', 'application/pdf')

    // Header to force download
    res.setHeader('Content-disposition', 'attachment')

    doc.pipe(res)

    doc.info = {
      Title: translate('salvia.accessibility-report'),
      Subject: translate('salvia.accessibility-report'),
      Keywords: 'accessibility, report, testing',
    }
    doc.registerFont('DejaVuSans', 'fonts/DejaVuSans.ttf')
    doc.font('DejaVuSans', 8)
    doc.text(report)

    // finalize the PDF and end the stream
    doc.end()
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

function getViewport(resolution) {
  return resolution.width + 'px X ' + resolution.height + 'px '
}
function getURLDescription(item) {
  return { url: item.inputUrl, description: item.description }
}

function getTestPageName(item) {
  return item.url + (item.description ? ' (' + item.description + ')' : '')
}

function createPDF(res, jsonReport, lang) {
  const locale = formatLang(lang) || 'en'

  i18n.setLocale(locale)

  const urls = jsonReport.urls
  const report = jsonReport.json.data
  let viewport
  //urls with descriptions (manual case)
  let urlList = []

  let flawsMap = new Map()

  let passedItems = []
  let inapplicableItems = []
  let failedItems = []
  let warningItems = []
  //warnings and failed
  let flaws = []

  Object.keys(report).map((url) => {
    let data = report[url]
    viewport = getViewport(data.system.page.viewport.resolution)
    urlList.push(getURLDescription(data.system.url))
    let modules = data.modules

    Object.keys(modules).map((m) => {
      let module = modules[m]
      let moduleMetadata = module.metadata

      let assertions = module.assertions
      Object.keys(assertions).map((r) => {
        let rule = assertions[r]
        rule.url = data.system.url //url: {inputUrl: ..., description: ...}

        let ruleOutcome = rule.metadata.outcome

        switch (ruleOutcome) {
          case 'passed':
            passedItems.push(rule)
            break
          case 'failed':
            failedItems.push(rule)
            flaws.push(rule)
            addToFlawsMap(flawsMap, rule)
            break
          case 'inapplicable':
            inapplicableItems.push(rule)
            break
          case 'warning':
            warningItems.push(rule)
            break
        }
      })
    })
  })

  try {
    const doc = new PDFDocument({
      pdfVersion: '1.5',
      lang: lang || 'en-US',
      tagged: true,
      displayTitle: true,
      bufferPages: true,
    })
    res.setHeader('Content-type', 'application/pdf')

    res.setHeader('Content-disposition', 'attachment')

    doc.pipe(res)

    doc.info = {
      Title: translate('salvia.accessibility-report'),
      Subject: translate('salvia.accessibility-report'),
      Keywords: 'accessibility, report, testing',
    }

    doc.registerFont('DejaVuSans', 'fonts/DejaVuSans.ttf')
    doc.registerFont('DejaVuSansMonoBook', 'fonts/dejavu-sans-mono.book.ttf')
    doc.font('DejaVuSans')

    // Initialize document logical structure
    const struct = doc.struct('Document')
    doc.addStructure(struct)

    // Get a reference to the Outline root
    const { outline } = doc

    // Header
    struct.add(createReportHeader(doc, jsonReport))

    // Report title

    struct.add(
      doc.struct('H1', () => {
        doc.fontSize(26).fillColor('purple').text(translate('salvia.report-title')).moveDown(1)
      }),
    )

    // Add bookmark
    outline.addItem(translate('salvia.report.details'))

    // Report details
    struct.add(createReportDetails(doc, jsonReport, viewport))

    doc.addPage()

    // Add bookmark
    outline.addItem(translate('salvia.report.tested-pages.summary'))

    // Tested pages
    const testedPages = doc.struct('Sect')

    struct.add(testedPages)

    addTestedPages(testedPages, doc, urlList)

    // Completed tests
    const completedTests = doc.struct('Sect')

    struct.add(completedTests)

    addCompletedTests(completedTests, doc, passedItems, flaws, inapplicableItems, warningItems)

    // Flaws chapter
    if (flaws.length > 0) {
      doc.addPage()

      // Add bookmark
      const flawsBookmark = outline.addItem(translate('salvia.report.accessibility-flaws.title'))

      // Found flaws
      const accessibilityFlaws = doc.struct('Sect')
      struct.add(accessibilityFlaws)

      createFlawsChapter(doc, accessibilityFlaws, flawsMap, flawsBookmark)
    }

    // page numbers
    addPageNumbers(doc)

    // finalize the PDF and end the stream
    doc.end()
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

function createReportHeader(doc /*, jsonReport*/) {
  const header = doc.struct('Sect', [
    doc.struct('Figure', { alt: 'logo ' }, () => {
      doc.image('images/salvia_logo.png', 70, 40, { width: 100 }).moveDown(3)
    }),

    () =>
      doc
        .fontSize(12)
        .fillColor('black')
        .text(translate('salvia.test-report'), { align: 'right' })
        .moveDown(1)
        .text(
          translate('salvia.report.print-date') + formatDateTime(DateTime.now(), 'dd.MM.yyyy'),
          { align: 'right' },
        )
        .moveDown(2),
  ])

  return header
}

function createReportDetails(doc, jsonReport, viewport) {
  const dateTime = formatDateTime(jsonReport.ts, 'dd.MM.yyyy HH:mm')
  const author = jsonReport.tester
  const domain = jsonReport.domain

  doc.fontSize(12).lineGap(5).fillColor('black')

  const reportDetails = doc.struct('Sect', [
    () => {
      doc.text(translate('salvia.tested-domain'), { continued: true })
    },
    doc.struct('Link', () => {
      doc.fillColor('purple').text(domain, { link: encodeURI(domain), continued: true })
    }),
    () => {
      doc
        .fillColor('black')
        .text(', ' + dateTime, { link: null })
        .moveDown(1)
    },
    () => {
      doc.text(translate('salvia.report.viewport') + viewport).moveDown(1)
    },
    doc.struct('P', [
      () => {
            doc.text(translate('salvia.report.salvia')).text(" (", {continued: true})
      },
      doc.struct('Link', () => {
        doc.fillColor('purple').text(translate('salvia.github.url'), {
          link: translate('salvia.github.url'),
          continued: true,
        })
      }),
        () => {
            doc.fillColor('black').text(translate("salvia.report.closing-bracket"), { link: null, continued: true }).text(translate('salvia.report.qualweb'), { continued: true }).text(" (", { continued: true })
        },
        doc.struct('Link', () => {
            doc.fillColor('purple').text(translate('salvia.qualweb.url'), {
                link: translate('salvia.qualweb.url'),
                continued: true,
            })
        }),
      () => {
        doc
          .fillColor('black').text("). ", { link: null, continued: true })
          .text(translate('salvia.report.act-rules') + " (", { /*link: null,*/ continued: true })
      },
      doc.struct('Link', () => {
        doc.fillColor('purple').text(translate('salvia.act-rules.url'), {
          link: translate('salvia.act-rules.url'),
          continued: true,
        })
      }),
      () => {
        doc.fillColor('black').text('). ', { link: null })
      },
    ]),
  ])

  return reportDetails
}

function addTestedPages(testedPages, doc, urlList) {
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  testedPages.add(
    doc.struct('H2', () => {
      doc
        .fontSize(22)
        .fillColor('purple')
        .text(translate('salvia.report.tested-pages.summary'))
        .moveDown(1)
    }),
  )

  testedPages.add(
    doc.struct('H3', () => {
      doc.fontSize(16).text(translate('salvia.report.tested-pages.title'))
    }),
  )

  testedPages.add(
    doc.struct('Artifact', { type: 'Layout' }, () =>
      doc
        .lineWidth(2)
        .strokeColor('purple')
        .moveTo(doc.x, doc.y)
        .lineTo(doc.x + pageWidth, doc.y)
        .stroke()
        .moveDown(0.5),
    ),
  )

  testedPages.add(
    doc.struct('H4', () =>
      doc
        .fillColor('black')
        .fontSize(12)
        .text(i18n.__mf('salvia.report.tested-pages.info', { count: urlList.length }))
        .moveDown(0.5),
    ),
  )

  // list of pages
  doc.x = doc.x + options.textIndent

  const list = doc.struct('L')
  testedPages.add(list)

  urlList.map((item) =>
    list.add(
      createListItem(
        { text: getTestPageName(item), isLink: true, url: item.url, highlight: true },
        doc,
        options,
      ),
    ),
  )

  doc.x = doc.x - options.textIndent
  doc.moveDown(2)

  testedPages.end()
}

function addCompletedTests(
  completedTests,
  doc,
  passedItems,
  flawsItems,
  inapplicableItems,
  warningItems,
) {
  const passedFormattedList = formatRulesList(passedItems)

  //only failed
  const flawsFormattedList = formatRulesList(flawsItems)

  const warningsFormattedList = formatRulesList(warningItems)

  const inapplicableFormattedList = formatRulesList(inapplicableItems)

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  completedTests.add(
    doc.struct('H3', () => {
      doc.fontSize(16).fillColor('purple').text(translate('salvia.report.completed-tests.title'))
    }),
  )

  completedTests.add(
    doc.struct('Artifact', { type: 'Layout' }, () =>
      doc
        .lineWidth(2)
        .strokeColor('purple')
        .moveTo(doc.x, doc.y)
        .lineTo(doc.x + pageWidth, doc.y)
        .stroke()
        .moveDown(0.5),
    ),
  )

  doc.fillColor('black')
  doc.fontSize(12)

  // failed
  const failedCount = flawsFormattedList.length
  completedTests.add(
    doc.struct('H4', () => {
      doc.text(i18n.__mf('salvia.report.failed-info', { count: failedCount })).moveDown(0.5)
    }),
  )

  if (failedCount > 0) {
    const failedList = doc.struct('L')
    completedTests.add(failedList)

    flawsFormattedList.map((item) => failedList.add(createRuleListItem(item, doc, options)))

    doc.x = doc.x - options.textIndent
  } else doc.text(translate('salvia.report.no-flaws-found'), { structParent: completedTests })

  doc.moveDown(2)

  // warnings
  const warningsCount = warningsFormattedList.length

  completedTests.add(
    doc.struct('H4', () => {
      doc.text(i18n.__mf('salvia.report.warning-info', { count: warningsCount })).moveDown(0.5)
    }),
  )

  if (warningsCount > 0) {
    const warningsList = doc.struct('L')
    completedTests.add(warningsList)

    warningsFormattedList.map((item) => warningsList.add(createRuleListItem(item, doc, options)))
    doc.x = doc.x - options.textIndent
  } else doc.text(translate('salvia.report.no-results'), { structParent: completedTests })

  doc.moveDown(2)

  // passed
  const passedCount = passedFormattedList.length
  completedTests.add(
    doc.struct('H4', () => {
      doc.text(i18n.__mf('salvia.report.passed-info', { count: passedCount })).moveDown(0.5)
    }),
  )

  if (passedCount > 0) {
    const passedList = doc.struct('L')
    completedTests.add(passedList)

    passedFormattedList.map((item) => passedList.add(createRuleListItem(item, doc, options)))
    doc.x = doc.x - options.textIndent
  } else doc.text(translate('salvia.report.no-results'), { structParent: completedTests })

  doc.moveDown(2)

  // inapplicable
  const inapplicableCount = inapplicableFormattedList.length
  completedTests.add(
    doc.struct('H4', () => {
      doc
        .text(i18n.__mf('salvia.report.inapplicable-info', { count: inapplicableCount }))
        .moveDown(0.5)
    }),
  )

  if (inapplicableCount > 0) {
    const inapplicableList = doc.struct('L')
    completedTests.add(inapplicableList)

    inapplicableFormattedList.map((item) =>
      inapplicableList.add(createRuleListItem(item, doc, options)),
    )
    doc.x = doc.x - options.textIndent
  } else doc.text(translate('salvia.report.no-results'), { structParent: completedTests })

  doc.moveDown(2)

  completedTests.end()
}

/*
 item: {text: text, isLink: true/false, url: url, highlight: true/false}
 */
function createListItem(item, doc, options) {
  const bulletRadius = options.bulletRadius || 3
  const textIndent = options.textIndent || bulletRadius * 5

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  const listItem = doc.struct('LI')

  listItem.add(
    doc.struct('Lbl', () => {
      doc.circle(doc.x - textIndent + bulletRadius, doc.y + 5, bulletRadius).fill('black')
    }),
  )
  const color = item.highlight ? 'purple' : 'black'
  const itemContent = item.isLink
    ? doc.struct('Link', () =>
        doc
          .fillColor(color)
          .text(item.text, { link: encodeURI(item.url), width: pageWidth - textIndent }),
      )
    : doc.struct('P', () => doc.text(item.text, { width: pageWidth - textIndent }))

  listItem.add(doc.struct('LBody', itemContent))

  listItem.end()

  return listItem
}

function createWCAGListItem(item, doc, options) {
  const bulletRadius = options.bulletRadius || 3
  const textIndent = options.textIndent || bulletRadius * 5
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  //format WCAG TR URL
  const url = item.url_tr ? formatURL_TR(item.url_tr, i18n.getLocale()) : item.url

  const listItem = doc.struct('LI')

  listItem.add(
    doc.struct('Lbl', () => {
      doc.circle(doc.x - textIndent + bulletRadius, doc.y + 5, bulletRadius).fill('black')
    }),
  )

  listItem.add(
    doc.struct('LBody', [
      () =>
        doc
          .fillColor('black')
          .text(
            'WCAG 2.1, ' + translate('salvia.level') + ' ' + item.level + ': ' + item.name + ' (',
            doc.page.margins.left + textIndent,
            doc.y,
            { continued: true },
          ),
      doc.struct('Link', () =>
        doc
          .fillColor('purple')
          .text(url, { link: url, width: pageWidth - textIndent, continued: true }),
      ),
      () => doc.fillColor('black').text(')', { link: false }),
    ]),
  )

  listItem.end()

  return listItem
}

function createSuccessCriteriaList(data, doc, options) {
  const list = doc.struct('L')
  list.add(
    createListItem({ text: data.url, isLink: true, url: data.url, highlight: true }, doc, options),
  )

  data['success-criteria'].map((item) => list.add(createWCAGListItem(item, doc, options)))

  return list
}

function createRuleList(listItems, doc, options) {
  const list = doc.struct('L')

  listItems.map((item) => list.add(createRuleListItem(item, doc, options)))

  return list
}

function createRuleListItem(item, doc, options) {
  const bulletRadius = options.bulletRadius || 3
  const textIndent = options.textIndent || bulletRadius * 5
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const pageHeight = doc.page.height - doc.page.margins.bottom - doc.page.margins.top

  const listItem = doc.struct('LI')

  const itemHeight = doc.heightOfString(item.code + ', ' + item.name + ' (' + item.url + ')')

  //list bullet and text item to fit both on the same page
  if (doc.y + itemHeight > pageHeight + doc.page.margins.top) {
    doc.addPage()
  }

  listItem.add(
    doc.struct('Lbl', () => {
      doc.circle(doc.page.margins.left + bulletRadius, doc.y + 5, bulletRadius).fill()
    }),
  )

  listItem.add(
    doc.struct('LBody', [
      () =>
        doc
          .fillColor('black')
          .text(item.code + ', ' + item.name + ' (', doc.page.margins.left + textIndent, doc.y, {
            continued: true,
          }),
      doc.struct('Link', () =>
        doc.fillColor('purple').text(item.url, { link: item.url, continued: true }),
      ),
      () => doc.fillColor('black').text(')', { link: false }),
    ]),
  )

  listItem.end()

  return listItem
}

function createFlawsChapter(doc, accessibilityFlaws, flawsMap, flawsBookmark) {
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const pageHeight = doc.page.height - doc.page.margins.bottom - doc.page.margins.top

  accessibilityFlaws.add(
    doc.struct('H2', () => {
      doc
        .fontSize(22)
        .fillColor('purple')
        .text(translate('salvia.report.accessibility-flaws.title'))
    }),
  )

  flawsMap.forEach((flawItems, key) => {
    flawItems.map((item, index) => {
      doc.moveDown(1)
      const startPos = 72
      const contentIndent = 30
      const indentedContentPos = startPos + contentIndent

      if (index == 0) {
        doc.font('DejaVuSans', 16)
        const ruleHeader = item.code + ' – ' + item.name
        const headerHeight = doc.heightOfString(ruleHeader)

        //add new page if rule header doesn't entirely fit
        if (doc.y + headerHeight > doc.page.height - doc.page.margins.top) {
          doc.addPage()
        }

        flawsBookmark.addItem(item.code)
        accessibilityFlaws.add(
          doc.struct('H3', () =>
            doc.fillColor('purple').text(item.code + ' – ' + item.name, startPos, doc.y),
          ),
        ) //check
        accessibilityFlaws.add(
          doc.struct('Artifact', { type: 'Layout' }, () =>
            doc
              .lineWidth(2)
              .strokeColor('purple')
              .moveTo(doc.x, doc.y)
              .lineTo(doc.x + pageWidth, doc.y)
              .stroke()
              .moveDown(0.5),
          ),
        )
        accessibilityFlaws.add(
          doc.struct('P', () => doc.fontSize(12).fillColor('black').text(item.description)),
        )

        doc.x = doc.x + options.textIndent
        accessibilityFlaws.add(createSuccessCriteriaList(item.metadata, doc, options))
        doc.x = doc.x - options.textIndent
        doc.moveDown(1)
      }

      accessibilityFlaws.add(
        doc.struct('H4', [
          () =>
            doc
              .font('DejaVuSans')
              .fontSize(12)
              .fillColor('purple')
              .text(translate('salvia.report.page'), startPos, doc.y, { continued: true }),
          doc.struct('Link', () => {
            doc.text(item.url.inputUrl, { link: encodeURI(item.url.inputUrl), continued: true })
          }),
          () =>
            doc.text(item.url.description ? ' (' + item.url.description + ')' : ' ', {
              continued: false,
            }),
        ]),
      )

      accessibilityFlaws.add(
        doc.struct('Artifact', { type: 'Layout' }, () =>
          doc
            .lineWidth(1)
            .strokeColor('purple')
            .moveTo(doc.x, doc.y)
            .lineTo(doc.x + pageWidth, doc.y)
            .stroke()
            .moveDown(0.5),
        ),
      )

      let isFirstFailed = true
      item.results.map((result, ind) => {
        if (result.verdict === 'failed') {
          doc.moveDown(1)

          // Add delimeter between element groups
          if (!isFirstFailed) {
            accessibilityFlaws.add(
              doc.struct('Artifact', { type: 'Layout' }, () =>
                doc
                  .lineWidth(1)
                  .strokeColor('purple')
                  .moveTo(doc.x, doc.y)
                  .lineTo(doc.x + pageWidth - contentIndent, doc.y)
                  .stroke()
                  .moveDown(2),
              ),
            )
          }

          result.elements.map((el) => {
            doc.font('DejaVuSans')
            const element = doc.struct('P', [
              () =>
                doc
                  .fillColor('purple')
                  .fontSize(12)
                  .text(translate('salvia.report.element'), indentedContentPos, doc.y),
              () => doc.fontSize(10).text(el.pointer),
            ])

            const elementHeight =
              doc.fontSize(12).heightOfString('Element') +
              doc.fontSize(10).heightOfString(el.pointer, { width: pageWidth - contentIndent })

            //add new page if element doesn't fit entirely
            if (doc.y + elementHeight > doc.page.height - doc.page.margins.top) doc.addPage()

            accessibilityFlaws.add(element)

            doc.font('DejaVuSansMonoBook', 8)

            const htmlCode = modifyHtmlCode(el.htmlCode, el.pointer)
            const maxHeigth = 65 // 5 rows of text (13x5)

            const blockHeight =
              Math.min(
                doc.heightOfString(htmlCode, { width: pageWidth - contentIndent }),
                maxHeigth,
              ) + 10 // + padding

            //add new page if code block doesn't fit entirely
            if (doc.y + blockHeight > doc.page.height - doc.page.margins.top) doc.addPage()

            const codeBlock = doc.struct('Div', [
              doc.struct('Artifact', { type: 'Layout' }, () =>
                doc
                  .lineWidth(1)
                  .rect(indentedContentPos, doc.y, pageWidth - contentIndent, blockHeight)
                  .fillAndStroke('#D3D3D3', '#808080'),
              ),

              doc.struct('Code', () =>
                doc
                  .fillColor('black')
                  .text(htmlCode, indentedContentPos, doc.y + 8, {
                    width: pageWidth - contentIndent,
                    align: 'center',
                    height: 65,
                    ellipsis: true,
                  })
                  .moveDown(2),
              ),
            ])

            accessibilityFlaws.add(codeBlock)
          })

          accessibilityFlaws.add(
            doc.struct('P', [
              () =>
                doc
                  .fillColor('purple')
                  .font('DejaVuSans')
                  .fontSize(12)
                  .text(translate('salvia.report.result'), { continued: true }),
              () => doc.fillColor('black').text(result.description),
            ]),
          )

          if (result.description === undefined) doc.moveDown(1)

          isFirstFailed = false
        }
      })
    })
  })
}

/*htmlCode modifications*/
function modifyHtmlCode(el, pointer) {
  let modifiedEl = el
  try {
    //remove all duplicate whitespaces, tabs, newlines
    modifiedEl = el.replace(/\s{2,}/g, ' ')

    //remove body from html element
    if (pointer === 'html') {
      const dom = new JSDOM(el)
      const document = dom.window.document
      document.body.textContent = ''

      modifiedEl = dom.window.document.documentElement.outerHTML
    }
  } catch (err) {
    console.log(err)
  }
  return modifiedEl
}

function formatRule(rule) {
  return { code: rule.code, name: rule.name, url: rule.metadata.url }
}

function formatRulesList(list) {
  let formattedList = []
  if (list.length > 0) {
    list.map((item) => {
      let formattedItem = formatRule(item)
      if (formattedList.findIndex((x) => x.code === formattedItem.code) === -1)
        formattedList.push(formattedItem)
    })
  }
  return formattedList
}

function addToFlawsMap(flawsMap, rule) {
  if (!flawsMap.has(rule.code)) {
    flawsMap.set(rule.code, new Array(rule))
  } else {
    let value = flawsMap.get(rule.code)
    value.push(rule)
    flawsMap.set(rule.code, value)
  }
}

function addPageNumbers(doc) {
  let pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    //Footer: Add page number
    let oldBottomMargin = doc.page.margins.bottom
    doc.page.margins.bottom = 0
    const pageNumber = doc.struct('Artifact', { type: 'Pagination' }, () =>
      doc
        .font('DejaVuSans', 10)
        .fillColor('gray')
        .text(
          `${i + 1}`,
          0,
          doc.page.height - 40, // Centered vertically in bottom margin
          { align: 'right' },
        ),
    )
    doc.addStructure(pageNumber)
    doc.page.margins.bottom = oldBottomMargin
  }
}

module.exports = { createPDF, createJSONPDF }
