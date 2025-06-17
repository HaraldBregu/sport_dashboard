import { ChartAreaDefault } from "@/components/chart-area-default"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartAreaLinear } from "@/components/chart-area-linear"
import { ChartAreaStep } from "@/components/chart-area-step"

export default function Content() {

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <ChartAreaInteractive />
            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                <ChartAreaLinear />
                <ChartAreaStep />
                <ChartAreaDefault />
            </div>
            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                <ChartAreaLinear />
                <ChartAreaStep />
                <ChartAreaDefault />
            </div>

            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                <ChartAreaLinear />
                <ChartAreaStep />
                <ChartAreaDefault />
            </div>

        </div>
    )

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
        </>
    )
}