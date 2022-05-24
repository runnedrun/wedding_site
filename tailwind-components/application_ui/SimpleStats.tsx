import React from "react";


interface Stats {
   statsTitle: string
   statsContent: string

}

export interface SimpleStatsProps {
    title: string;
    stats: Stats[];

}

export const exampleProps :SimpleStatsProps = {
    title: "Last 30 days",
    stats:[
        {
            statsTitle: "Total Subscribers",
            statsContent: "71,897"
        },
        {
            statsTitle: "Avg. Open Rate",
            statsContent: "58.16%"
        },
        {
            statsTitle: "Avg. Click Rate",
            statsContent: "24.57%"
        },
    ]
}

export const SimpleStats = ({
    title,
    stats
}:SimpleStatsProps) => {
    return(
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
        </h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map ((s) => {
            return(
              <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {s.statsTitle}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {s.statsContent}
                </dd>
            </div>
            )
          }) }
        </dl>
    </div>
    )
}
