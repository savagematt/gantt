'use client'
import React, {createContext, useEffect} from "react";
import {Chart} from "react-google-charts";
import Papa from 'papaparse';

const Context = createContext(undefined)

export default function Home() {
    const ganttChartData = [
        [
            {type: 'string', label: 'Task ID'},
            {type: 'string', label: 'Task Name'},
            {type: 'date', label: 'Start Date'},
            {type: 'date', label: 'End Date'},
            {type: 'number', label: 'Duration'},
            {type: 'number', label: 'Percent Complete'},
            {type: 'string', label: 'Dependencies'},
        ],
        [
            'Research',
            'Find sources',
            new Date(2015, 0, 1),
            new Date(2015, 0, 5),
            null,
            100,
            null,
        ],
        [
            'Write',
            'Write paper',
            null,
            new Date(2015, 0, 9),
            3 * 24 * 60 * 60 * 1000,
            25,
            'Research,Outline',
        ],
        [
            'Cite',
            'Create bibliography',
            null,
            new Date(2015, 0, 7),
            1 * 24 * 60 * 60 * 1000,
            20,
            'Research',
        ],
        [
            'Complete',
            'Hand in paper',
            null,
            new Date(2015, 0, 10),
            1 * 24 * 60 * 60 * 1000,
            0,
            'Cite,Write',
        ],
        [
            'Outline',
            'Outline paper',
            null,
            new Date(2015, 0, 6),
            1 * 24 * 60 * 60 * 1000,
            100,
            'Research',
        ],
    ];
    const [data,setGanttChartData] = React.useState([] as any[]);
    useEffect(() => {
        fetch("https://docs.google.com/spreadsheets/d/1U0yC3_aCX4qYYbkVZvbMrZZwwcoI-WSxRUsJXR8wAq4/gviz/tq?tqx=out:csv&sheet=gantt")
            .then(response => {
                return response.text()
            })
            .then(text => Papa.parse(text))
            .then(data => (data.data as (string | number)[][]).map((row, i: number) => {
                if (i === 0) return         [
                    {type: 'string', label: 'Task ID'},
                    {type: 'string', label: 'Task Name'},
                    {type: 'string', label: 'Resource ID'},
                    {type: 'date', label: 'Start Date'},
                    {type: 'date', label: 'End Date'},
                    {type: 'number', label: 'Duration'},
                    {type: 'number', label: 'Percent Complete'},
                    {type: 'string', label: 'Dependencies'},
                ];
                let description = row[1];
                if (!description) {
                    description = row[0].toString().replaceAll("_", " ");
                }
                return row.map((cell, j) => {
                    if (j === 0) return cell;
                    if (j === 1) return description;
                    if (j === 3 || j === 4) {
                        let date = new Date(cell as string);
                        if (date.toString() === "Invalid Date") {
                            return null;
                        }
                        return date;
                    }
                    if (j === 5) return cell as number * 24 * 60 * 60 * 1000;
                    if (j === 6) return typeof cell === "number" ? cell : 0
                    if (j === 7) return cell;
                    return cell;
                });
            })).then(data => {
            console.log(data);
            return data;
        })
            .then(setGanttChartData)
    }, []);

    return (
        <div className="container mt-5 h-full">
            <h2>Building works</h2>
            <Chart
                width={'100%'}
                height={'calc(100%-2rem)'}
                chartType="Gantt"
                loader={<div>Loading Chart</div>}
                data={data}
                rootProps={{'data-testid': '1'}}
            />
        </div>
    )
}
