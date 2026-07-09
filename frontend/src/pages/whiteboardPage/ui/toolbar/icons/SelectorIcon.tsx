type SelectorIconProps = {
    color: string
}

const SelectorIcon = ({ color }: SelectorIconProps) => {
    return (
        <svg
            fill="currentColor"
            version="1.1"
            viewBox="-6 -6 36 36"
            enableBackground="new 0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path d="M23,15c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v5C24,14.6,23.6,15,23,15z" />
                <path d="M14,24H9c-0.6,0-1-0.4-1-1s0.4-1,1-1h5c0.6,0,1,0.4,1,1S14.6,24,14,24z" />
                <path d="M1,15c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v5C2,14.6,1.6,15,1,15z" />
                <path d="M23,6c-0.6,0-1-0.4-1-1V4c0-1.1-0.9-2-2-2h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c2.2,0,4,1.8,4,4v1C24,5.6,23.6,6,23,6z" />
                <path d="M1,6C0.4,6,0,5.6,0,5V4c0-2.2,1.8-4,4-4h1c0.6,0,1,0.4,1,1S5.6,2,5,2H4C2.9,2,2,2.9,2,4v1C2,5.6,1.6,6,1,6z" />
                <path d="M14,2H9C8.4,2,8,1.6,8,1s0.4-1,1-1h5c0.6,0,1,0.4,1,1S14.6,2,14,2z" />
                <path d="M5,24H4c-2.2,0-4-1.8-4-4v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2c0,1.1,0.9,2,2,2h1c0.6,0,1,0.4,1,1S5.6,24,5,24z" />
                <path d="M20,24h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c1.1,0,2-0.9,2-2v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C24,22.2,22.2,24,20,24z" />
            </g>
        </svg>
    )
}
export default SelectorIcon

// https://www.svgrepo.com/svg/500275/selection-subtract