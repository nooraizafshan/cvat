// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useSelector } from 'react-redux';

import { Project, Task, Job } from 'cvat-core-wrapper';
import { CombinedState } from 'reducers';
import { TimePeriod } from '.';
import AnnotationCountChart from './annotation-count-chart';

interface Props {
    resource: Project | Task | Job;
    timePeriod: TimePeriod | null;
}

function AnalyticsReportContent({ resource }: Readonly<Props>): JSX.Element {
    return <AnnotationCountChart resource={resource} />;
}

function AnalyticsReportContentWrap(props: Readonly<Props>): JSX.Element {
    const overrides = useSelector(
        (state: CombinedState) => state.plugins.overridableComponents.analyticsReportPage.content,
    );

    if (overrides.length) {
        const [Component] = overrides.slice(-1);
        return <Component {...props} />;
    }

    return <AnalyticsReportContent {...props} />;
}

export default React.memo(AnalyticsReportContentWrap);
