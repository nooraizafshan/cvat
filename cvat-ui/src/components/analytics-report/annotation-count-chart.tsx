// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from 'react';
import Alert from 'antd/lib/alert';
import Card from 'antd/lib/card';
import Empty from 'antd/lib/empty';
import Select from 'antd/lib/select';
import { Bar } from 'react-chartjs-2';
import {
    BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip,
} from 'chart.js';
import { Project, Task, Job } from 'cvat-core-wrapper';
import CVATLoadingSpinner from 'components/common/loading-spinner';

import './styles.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface AnnotationCount {
    label: string;
    count: number;
}

interface Props {
    resource: Project | Task | Job;
}

interface AnnotationCountResponse {
    results: AnnotationCount[];
}

function isAnnotationCount(value: unknown): value is AnnotationCount {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as { label?: unknown; count?: unknown };
    return typeof candidate.label === 'string' &&
        typeof candidate.count === 'number' &&
        Number.isFinite(candidate.count);
}

function AnnotationCountChart({ resource }: Readonly<Props>): JSX.Element {
    const [counts, setCounts] = useState<AnnotationCount[]>([]);
    const [annotationType, setAnnotationType] = useState<string | undefined>();
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!(resource instanceof Task)) {
            setFetching(false);
            return undefined;
        }

        const controller = new AbortController();
        setFetching(true);
        setError(null);

        // The annotation count endpoint returns { results: [{ label, count }] }.
        const params = new URLSearchParams({ task_id: String(resource.id) });
        if (annotationType) {
            params.set('annotation_type', annotationType);
        }

        fetch(`/api/annotations/count?${params.toString()}`, {
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Annotation count request failed (${response.status})`);
                }
                const payload: unknown = await response.json();
                if (!payload || typeof payload !== 'object' ||
                    !Array.isArray((payload as AnnotationCountResponse).results)) {
                    throw new Error('The annotation count response has an invalid shape');
                }

                const values = (payload as AnnotationCountResponse).results;
                if (!values.every(isAnnotationCount)) {
                    throw new Error('The annotation count response has an invalid shape');
                }
                return values;
            })
            .then((values) => {
                setCounts(values);
            })
            .catch((requestError: unknown) => {
                if (!controller.signal.aborted) {
                    setError(requestError instanceof Error ? requestError : new Error('Could not load annotation counts'));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setFetching(false);
                }
            });

        return () => controller.abort();
    }, [resource, annotationType]);

    if (!(resource instanceof Task)) {
        return <Empty description='Annotation counts are available for tasks only' />;
    }

    if (fetching) {
        return <CVATLoadingSpinner />;
    }

    if (error) {
        return (
            <Alert
                type='error'
                showIcon
                message='Could not load annotation counts'
                description={error.message}
            />
        );
    }

    if (!counts.length) {
        return <Empty description='No annotations found' />;
    }

    return (
        <Card
            title='Annotations by label'
            className='cvat-annotation-count-chart'
            extra={(
                <Select
                    aria-label='Filter annotation type'
                    allowClear
                    placeholder='All types'
                    value={annotationType}
                    onChange={(value: string | undefined) => setAnnotationType(value)}
                    options={[
                        { value: 'shape', label: 'Shapes' },
                        { value: 'track', label: 'Tracks' },
                        { value: 'image', label: 'Images' },
                        { value: 'interval', label: 'Intervals' },
                    ]}
                />
            )}
        >
            <Bar
                data={{
                    labels: counts.map((item) => item.label),
                    datasets: [{
                        label: 'Annotations',
                        data: counts.map((item) => item.count),
                        backgroundColor: '#1890ff',
                    }],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                }}
            />
        </Card>
    );
}

export default React.memo(AnnotationCountChart);
