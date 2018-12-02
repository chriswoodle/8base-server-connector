require('dotenv').config();

import gql from 'graphql-tag';

import { GraphQLClient } from 'graphql-request';

if (!process.env.GRAPHQL_HOST) throw new Error('Missing process.env.GRAPHQL_HOST!');
if (!process.env.API_TOKEN) throw new Error('Missing process.env.API_TOKEN!');

const client = new GraphQLClient(process.env.GRAPHQL_HOST,
    {
        headers: {
            'authorization': process.env.API_TOKEN
        }
    });

export interface HealthRecordParameters {
    lon?: number,
    lat?: number,
    speed?: number,
    stepCount?: number,
    distance?: number,
    gender?: 'male' | 'female',
    heartRate?: number,
    time?: Date
}

export type HealthRecord = HealthRecordParameters & {
    id: string
} 

export interface HealthListResponse {
    healthDataList: {
        items: HealthRecord[]
    }
}

export const listHealthData = () => {
    const query = gql`
        query HealthRecord {
            healthDataList {
                items {
                    id
                    lon
                    lat
                    speed
                    stepCount
                    distance
                    gender

                }
            }
        }
        `;

    return client.request<HealthListResponse>(query);
}

export interface HealthDatumCreateResponse {
    healthDatumCreate: {
        id: string
    }
}

export const createHealthDatum = (record: HealthRecordParameters) => {
    const query = gql`
        mutation HealthDatumCreateMutation($data: HealthDatumCreateInput!) {
            healthDatumCreate(data: $data) {
                id
            }
        }`;

    const variables = {
        "data": record
    };

    return client.request<HealthDatumCreateResponse>(query, variables);
}