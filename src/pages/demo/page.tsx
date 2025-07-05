import { AppButton } from "@/components/app/app-button";
import { useTheme } from "next-themes";
import {
    Heart,
    Star,
    Settings,
    User,
    ArrowRight,
    ArrowLeft,
    Plus,
    Check,
    X,
    Sun,
    Moon
} from "lucide-react";


const Account = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g id="Icons / General / Account">
                <path id="Shape" d="M12 11.6914C11.0375 11.6914 10.2136 11.3487 9.52825 10.6634C8.84275 9.97791 8.5 9.15391 8.5 8.19141C8.5 7.22891 8.84275 6.40499 9.52825 5.71966C10.2136 5.03416 11.0375 4.69141 12 4.69141C12.9625 4.69141 13.7864 5.03416 14.4718 5.71966C15.1573 6.40499 15.5 7.22891 15.5 8.19141C15.5 9.15391 15.1573 9.97791 14.4718 10.6634C13.7864 11.3487 12.9625 11.6914 12 11.6914ZM4.5 19.3069V17.0837C4.5 16.594 4.633 16.1405 4.899 15.7232C5.165 15.3058 5.5205 14.985 5.9655 14.7607C6.95383 14.2762 7.95092 13.9127 8.95675 13.6704C9.96258 13.4281 10.977 13.3069 12 13.3069C13.023 13.3069 14.0374 13.4281 15.0433 13.6704C16.0491 13.9127 17.0462 14.2762 18.0345 14.7607C18.4795 14.985 18.835 15.3058 19.101 15.7232C19.367 16.1405 19.5 16.594 19.5 17.0837V19.3069H4.5ZM6 17.8069H18V17.0837C18 16.8812 17.9413 16.6937 17.824 16.5212C17.7067 16.3488 17.5474 16.2082 17.3462 16.0992C16.4846 15.6748 15.6061 15.3533 14.7107 15.1347C13.8152 14.9162 12.9117 14.8069 12 14.8069C11.0883 14.8069 10.1848 14.9162 9.28925 15.1347C8.39392 15.3533 7.51542 15.6748 6.65375 16.0992C6.45258 16.2082 6.29333 16.3488 6.176 16.5212C6.05867 16.6937 6 16.8812 6 17.0837V17.8069ZM12 10.1914C12.55 10.1914 13.0208 9.99557 13.4125 9.60391C13.8042 9.21224 14 8.74141 14 8.19141C14 7.64141 13.8042 7.17057 13.4125 6.77891C13.0208 6.38724 12.55 6.19141 12 6.19141C11.45 6.19141 10.9792 6.38724 10.5875 6.77891C10.1958 7.17057 10 7.64141 10 8.19141C10 8.74141 10.1958 9.21224 10.5875 9.60391C10.9792 9.99557 11.45 10.1914 12 10.1914Z" />
            </g>
        </svg>

    )
}

export default function DemoPage() {
    const { theme, setTheme } = useTheme();

    const variants = [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'primary',
        'success',
        'warning',
        'info',
        'error',
        'gradient',
        'glass',
        'sport',
        'toolbar',
        'muted',
        'dark',
        'light',
        'brand'
    ] as const;

    const sizes = ['sm', 'default', 'lg', 'xl', '2xl', 'compact'] as const;
    const roundedOptions = ['none', 'sm', 'default', 'lg', 'xl', 'full'] as const;
    const shadowOptions = ['none', 'sm', 'default', 'lg', 'xl'] as const;

    return (
        <div className="p-8 space-y-12">

            <section>
                <Account className="w-10 h-10 fill-red-500 dark:fill-amber-300" />
                <Account className="w-14 h-14 fill-blue-500 dark:fill-amber-300" />
                <Account className="w-10 h-10 fill-blue-500 dark:fill-amber-300" />

            </section>

            {/* Theme Toggle Section */}
            <section className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Button Component Demo</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {theme === 'dark' ? 'Dark' : 'Light'} Mode
                    </span>
                    <AppButton
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="transition-all duration-200"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </AppButton>
                </div>
            </section>

       

            {/* Sizes Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Button Sizes</h2>
                <div className="flex flex-wrap items-center gap-4">
                    {sizes.map((size) => (
                        <div key={size} className="space-y-2">
                            <p className="text-sm font-medium text-gray-600 capitalize">{size}</p>
                            <AppButton size={size}>
                                {size}
                            </AppButton>
                        </div>
                    ))}
                </div>
            </section>

            {/* Rounded Options Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Rounded Options</h2>
                <div className="flex flex-wrap items-center gap-4">
                    {roundedOptions.map((rounded) => (
                        <div key={rounded} className="space-y-2">
                            <p className="text-sm font-medium text-gray-600 capitalize">{rounded}</p>
                            <AppButton rounded={rounded}>
                                {rounded}
                            </AppButton>
                        </div>
                    ))}
                </div>
            </section>

            {/* Shadow Options Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Shadow Options</h2>
                <div className="flex flex-wrap items-center gap-4">
                    {shadowOptions.map((shadow) => (
                        <div key={shadow} className="space-y-2">
                            <p className="text-sm font-medium text-gray-600 capitalize">{shadow}</p>
                            <AppButton shadow={shadow}>
                                {shadow}
                            </AppButton>
                        </div>
                    ))}
                </div>
            </section>

           
            {/* Full Width Example */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Full Width Example</h2>
                <div className="space-y-4">
                    <AppButton variant="default" fullWidth>
                        Full Width Button
                    </AppButton>
                    <AppButton variant="gradient" fullWidth>
                        Full Width Gradient
                    </AppButton>
                </div>
            </section>


            {/* Buttons with Right Icons Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Buttons with Right Icons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Arrow Right</p>
                        <AppButton variant="default">
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Arrow Left</p>
                        <AppButton variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </AppButton>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Check</p>
                        <AppButton variant="success">
                            Save
                            <Check className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">X</p>
                        <AppButton variant="destructive">
                            Cancel
                            <X className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Settings</p>
                        <AppButton variant="secondary">
                            Settings
                            <Settings className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Star</p>
                        <AppButton variant="warning">
                            Favorite
                            <Star className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>
                </div>
            </section>

         

            {/* Mixed Icon Examples Section */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Mixed Icon Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sport with Icons</h3>
                        <AppButton variant="sport" size="lg">
                            <Heart className="mr-2 h-4 w-4" />
                            Like
                            <Star className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Glass with Icons</h3>
                        <AppButton variant="glass" size="lg">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                            <Settings className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Gradient with Icons</h3>
                        <AppButton variant="gradient" size="lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Create
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </AppButton>
                    </div>
                </div>
            </section>



        </div>
    )
}