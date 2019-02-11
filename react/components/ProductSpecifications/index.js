import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import HtmlParser from 'react-html-parser'
import GradientCollapse from './GradientCollapse'

import { Tabs, Tab } from 'vtex.styleguide'

import styles from './styles.css'

class ProductSpecifications extends Component {

  state = { currentTab: 0 }

  handleTabChange(tabIndex) {
    this.setState({
      currentTab: tabIndex,
    })
  }

  get specificationItems(){
    return this.props.specifications.map(specification => {
      return { property: specification.name, specifications: specification.values[0] }
    })
  }

  get tableView(){
    const { specifications } = this.props;

    return(
      <Fragment>
        {specifications.length > 0 && (
          <div className={`${styles.specifications} mt9 mt0-l pl8-l`}>
            <FormattedMessage id="technicalspecifications.title">
              {(txt) => (
                <h2 className={`${styles.specificationsTitle} t-heading-5 mb5 mt0`}>{HtmlParser(txt)}</h2>
              )}
            </FormattedMessage>
            <GradientCollapse collapseHeight={220}>
              <table className={`${styles.specificationsTable} w-100 bg-base border-collapse`}>
                <thead>
                  <tr>
                    <th className="w-50 b--muted-4 bb bt c-muted-2 t-body tl pa5">
                      <FormattedMessage id="product-description.property" />
                    </th>
                    <th className="w-50 b--muted-4 bb bt c-muted-2 t-body tl pa5">
                      <FormattedMessage id="product-description.specification" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.specificationItems.map((specification, i) => (
                    <tr key={i}>
                      <td className="w-50 b--muted-4 bb pa5">{HtmlParser(specification.property)}</td>
                      <td className="w-50 b--muted-4 bb pa5">{HtmlParser(specification.specifications)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GradientCollapse>
          </div>
        )}
      </Fragment>
    )
  }

  get tabsView(){
    const { currentTab } = this.state;

    return(
      <div className="pt8">
        <Tabs fullWidth>
          {
            this.specificationItems.map((specification, i) => (
              <Tab label={HtmlParser(specification.property)} active={currentTab === i} onClick={() => this.handleTabChange(i)}>
                <div className="pb8 c-muted-1">
                  <GradientCollapse collapseHeight={300}>
                    {HtmlParser(specification.specifications)}
                  </GradientCollapse>
                </div>
              </Tab>
            ))
          }
        </Tabs>
      </div>
    )
  }

  render(){
    return this.props.tabs ? this.tabsView : this.tableView
  }
}

export default ProductSpecifications