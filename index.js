import express from 'express'
import {ThermalPrinter , PrinterTypes}  from 'node-thermal-printer'
import cors from 'cors'

const port = 5000;


const app = express()
app.use(express.json())
app.use(cors())

// app.use(bodyParser.json());

// Endpoint to handle print requests
app.post('/print', async (req, res) => {
  const { content } = req.body;

  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // Change this to your printer type
    // interface: 'tcp://192.168.1.100' // Change this to your printer's IP address or USB path
    interface: '/dev/usb/lp0',// Change this to your printer's IP address or USB path

  });

  try {
    console.log("printer is===" , printer);
    console.log('Checking printer connection...');
    const isConnected = await printer.isPrinterConnected();
    console.log('Printer connected:', isConnected);
    if (!isConnected) {
      return res.status(500).send({ success: false, error: 'Printer is not connected' });

    }

    console.log('Starting print job...');

    printer.alignCenter();
    printer.println("Hello world");
    // printer.cut();

    let execute = await printer.execute();
    console.log('Print success:', execute);
    res.send({ success: true, message: 'Print job submitted successfully' });
  } catch (error) {
    console.error('Print error:', error);
    res.status(500).send({ success: false, error: 'Printing failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});