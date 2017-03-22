/**
 * @flow
 */
import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import type { ColumnType, RelationType, TableType, UiType } from '../utils/flowtypes';

const exportTooltip = (
    <Tooltip id='export-tooltip'><strong>Generate Database Migrations</strong></Tooltip>
);

class ExportDatabase extends Component {
    props: Props

    // Flow type for refs
    download: any
    form: any

    handleSubmit = () => {
        if (typeof window.schema === 'object' &&
                window.schema.packageMode) {
            this.form.submit();
        } else {
            const { data } = this.props;
            const jsonData = JSON.stringify(data, null, 4);
            const url = `data:application/json;charset=utf8,${ encodeURIComponent(jsonData) }`;

            this.download.setAttribute('href', url);
            this.download.setAttribute('download', 'schema.json');
            this.download.click();
        }
    }

    render() {
        console.log('ExportDatabase rendering'); // eslint-disable-line no-console
        const { data } = this.props;
        const node = document.querySelector('meta[name="csrf-token"]');
        let csrfToken = '';

        if (node) {
            csrfToken = node.getAttribute('content');
        }

        return (
            <li>
                <form
                    className='form-inline'
                    method='POST'
                    action=''
                    ref={ (form) => { this.form = form; } }
                >
                    <input type='hidden' name='schema' value={ JSON.stringify(data) } />
                    <input type='hidden' name='_token' value={ csrfToken } />
                </form>
                <OverlayTrigger
                    placement='bottom'
                    overlay={ exportTooltip }
                    delayShow={ 300 }
                    rootClose
                >
                    <button
                        className='fa fa-download'
                        onClick={ this.handleSubmit }
                        disabled={ !data.tables.length }
                    >
                    </button>
                </OverlayTrigger>
                <a className='hidden' ref={ (download) => { this.download = download; } }>
                    Export as JSON
                </a>
            </li>
        );
    }
}

type Props = {
    data: {
        database: {
            name: string
        },
        ui: UiType,
        tables: Array<TableType>,
        columns: {
            [tableId: string]: Array<ColumnType>
        },
        relations: Array<RelationType>
    }
};

export default ExportDatabase;
