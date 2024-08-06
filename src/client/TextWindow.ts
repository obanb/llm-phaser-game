export default class TextWindow {
    private scene: Phaser.Scene;
    private text: Phaser.GameObjects.Text;
    private background: Phaser.GameObjects.Rectangle;
    private content: string = ''; // Store the current content
    public isOpened: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        this.scene = scene;

        // Create a background rectangle for the text window
        this.background = scene.add.rectangle(x, y, width, height, 0x000000, 0.8);
        this.background.setOrigin(0.5);

        // Create the text object
        this.text = scene.add.text(x, y, this.content, {
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: width - 20 },
            align: 'left',
        });
        this.text.setOrigin(0.5);

        // Initially hide the text window
        this.hide();
    }

    // Show the text window with specific text
    show() {
        this.isOpened = true;
        this.text.setText(this.content);
        this.background.setVisible(true);
        this.text.setVisible(true);
    }

    // Hide the text window
    hide() {
        this.background.setVisible(false);
        this.text.setVisible(false);
    }

    // Update the position of the text window
    setPosition(x: number, y: number) {
        this.background.setPosition(x, y);
        this.text.setPosition(x, y);
    }

    // Add text to the window
    addText(newText: string) {
        this.content += newText;
        this.text.setText(this.content);
    }

    // Remove the last character (for backspace)
    removeLastCharacter() {
        this.content = this.content.slice(0, -1);
        this.text.setText(this.content);
    }

    // Clear the window
    clearText() {
        this.content = '';
        this.text.setText(this.content);
    }
}