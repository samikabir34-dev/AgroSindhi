import { useEffect, useState } from 'react';

interface FloatingElement {
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    color: string;
}

const FloatingElements = () => {
    const [elements, setElements] = useState<FloatingElement[]>([]);

    useEffect(() => {
        const colors = [
            'from-[#55e6ff]/[0.015] to-[#8d7cff]/[0.02]',
            'from-[#ffd166]/[0.012] to-[#55e6ff]/[0.015]',
            'from-[#8d7cff]/[0.015] to-[#34d399]/[0.02]',
            'from-[#34d399]/[0.015] to-[#ffd166]/[0.02]',
        ];

        // Generate subtle floating circles
        const generated: FloatingElement[] = Array.from({ length: 4 }, (_, i) => ({
            id: i,
            size: Math.random() * 220 + 60,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 18 + 12,
            delay: Math.random() * 4,
            color: colors[i % colors.length],
        }));

        setElements(generated);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Ambient radial glows tailored to sindhilanguage.org's visual language */}
            <div className="absolute top-[-15%] right-[-8%] w-[520px] h-[520px] bg-[#55e6ff]/[0.04] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-8%] left-[-8%] w-[420px] h-[420px] bg-[#8d7cff]/[0.03] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute top-[40%] left-[30%] w-[320px] h-[320px] bg-[#ffd166]/[0.02] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s' }} />

            {elements.map((el) => (
                <div
                    key={el.id}
                    className={`absolute rounded-full bg-gradient-to-br ${el.color}`}
                    style={{
                        width: `${el.size}px`,
                        height: `${el.size}px`,
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        opacity: 0.55,
                        animation: `float-bubble ${el.duration}s ease-in-out ${el.delay}s infinite alternate`,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingElements;
