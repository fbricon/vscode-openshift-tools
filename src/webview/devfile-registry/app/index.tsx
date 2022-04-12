/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './home';
import { DetailsPage } from './detailsPage';
import { VSCodeMessage } from '../vsCodeMessage';

VSCodeMessage.postMessage('getAllComponents');
ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/index.html" element={<Home />} />
            <Route path="/devfiles/*" element={<DetailsPage />} />
        </Routes>
    </Router>,
    document.getElementById('root'),
);
