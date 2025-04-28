type Colour = "green" | "black" | "blue" | "pink" | "purple" | "orange" | "red"

interface ColourPickerProps {
    selectedColour: Colour
    setSelectedColour: React.Dispatch<React.SetStateAction<Colour>>;
}

const ColourPicker: React.FC<ColourPickerProps> = ({selectedColour, setSelectedColour}) => {

    // Array of colors you want to show in the picker
    const colors: Colour[] = ['red', 'pink', 'orange', 'green', 'blue', 'purple', 'black'];
    // Handle color selection
    const handleColorSelect = (colour: "green" | "black" | "blue" | "pink" | "purple" | "orange" | "red") => {
        setSelectedColour(colour);
    };

    return (
        <div className="flex items-center gap-4">
            {colors.map((colour, index) => (
                <div
                    key={index}
                    onClick={() => handleColorSelect(colour)}
                    style={{
                        width: '33px',
                        height: '33px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        opacity: (selectedColour !== colour) ? '40%' : '100%',
                    }}
                    className={`border${colour} bg${colour} transform transition-all duration-200 scale-110`}
                ></div>
            ))}
        </div>
    );
};

export default ColourPicker;
