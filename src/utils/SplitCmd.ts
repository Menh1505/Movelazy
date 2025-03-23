export default function SplitCmd(commandStr: string): { cmd: string | undefined, args: { [key: string]: string } } {
    const command = commandStr.split(' ');

    const cmd = command.shift();
    const args: { [key: string]: string } = {};

    command.forEach(arg => {
        if (arg.includes('=')) {
            const [key, value] = arg.split('=');
            args[key] = value;
        } else {
            args[arg] = "1";
        }
    });
    return { cmd, args };
}
