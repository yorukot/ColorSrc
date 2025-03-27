"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorFormat, detectColorFormat, processMultiLineInput } from "@/lib/colorConversion";
import { ArrowRightLeft, Check, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Available color formats with user-friendly names
const colorFormats: { value: ColorFormat; label: string }[] = [
  { value: "auto", label: "Auto Detect" },
  { value: "hex", label: "HEX" },
  { value: "hsl", label: "HSL" },
  { value: "oklab", label: "OKLAB" },
  { value: "oklch", label: "OKLCH" },
  { value: "rgb", label: "RGB" },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut" 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

export function ColorConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<Array<{ 
    original: string; 
    converted: string | null; 
    detectedFormat?: ColorFormat;
  }>>([]);
  const [copied, setCopied] = useState(false);
  const [sourceFormat, setSourceFormat] = useState<ColorFormat>("auto");
  const [targetFormat, setTargetFormat] = useState<ColorFormat>("oklch");
  const [converting, setConverting] = useState(false);
  const [detectedFormats, setDetectedFormats] = useState<Record<string, ColorFormat>>({});
  const [simplified, setSimplified] = useState(false);

  // Ensure source and target formats are never the same (except for auto)
  useEffect(() => {
    if (sourceFormat !== 'auto' && sourceFormat === targetFormat) {
      // If they're the same, choose a different target format
      const availableFormats = colorFormats
        .map(f => f.value)
        .filter(f => f !== sourceFormat && f !== 'auto');
      setTargetFormat(availableFormats[0] || "oklch");
    }
  }, [sourceFormat, targetFormat]);

  // Auto-detect the format as the user types
  useEffect(() => {
    if (sourceFormat === 'auto' && input.trim()) {
      const lines = input.split('\n');
      const newDetectedFormats: Record<string, ColorFormat> = {};
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          const detected = detectColorFormat(line.trim());
          if (detected) {
            newDetectedFormats[index] = detected;
          }
        }
      });
      
      setDetectedFormats(newDetectedFormats);
    } else {
      setDetectedFormats({});
    }
  }, [input, sourceFormat]);

  const handleConvert = () => {
    if (!input.trim()) return;
    
    setConverting(true);
    // Add a small delay to show the animation
    setTimeout(() => {
      const results = processMultiLineInput(input, sourceFormat, targetFormat, simplified);
      setOutput(results);
      setConverting(false);
    }, 600);
  };

  const copyToClipboard = () => {
    const textToCopy = output
      .map(item => item.converted || item.original) // Use original text for failed conversions
      .join('\n');
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swapFormats = () => {
    if (sourceFormat !== 'auto') {
      setSourceFormat(targetFormat);
      setTargetFormat(sourceFormat);
    }
  };

  // Handle source format change
  const handleSourceFormatChange = (value: string) => {
    const newFormat = value as ColorFormat;
    setSourceFormat(newFormat);
    if (newFormat !== 'auto' && newFormat === targetFormat) {
      // If new source format is the same as target, update target
      const availableFormats = colorFormats
        .map(f => f.value)
        .filter(f => f !== newFormat && f !== 'auto');
      setTargetFormat(availableFormats[0] || "oklch");
    }
  };

  // Handle target format change
  const handleTargetFormatChange = (value: string) => {
    const newFormat = value as ColorFormat;
    setTargetFormat(newFormat);
    if (sourceFormat !== 'auto' && newFormat === sourceFormat) {
      // If new target format is the same as source, update source
      const availableFormats = colorFormats
        .map(f => f.value)
        .filter(f => f !== newFormat && f !== 'auto');
      setSourceFormat(availableFormats[0] || "hex");
    }
  };

  // Toggle simplified format
  const toggleSimplified = () => {
    setSimplified(prev => !prev);
    // If we have output already, regenerate it with the new simplified setting
    if (output.length > 0 && !converting) {
      const results = processMultiLineInput(input, sourceFormat, targetFormat, !simplified);
      setOutput(results);
    }
  };

  // Get placeholder based on source format
  const getPlaceholder = () => {
    if (sourceFormat === 'auto') {
      return "Enter any color format - it will be automatically detected!\n#ff0044\nhsl(344 100% 50%)\noklch(0.63 0.25 20)\n--sidebar-border: oklch(1 0 0 / 10%)";
    }
    
    const examples: Record<ColorFormat, string[]> = {
      auto: [],
      hex: ["#ff0044", "#03c", "--primary: #2563eb;"],
      hsl: ["hsl(344 100% 50%)", "243 33% 14%", "--text: hsl(220 14% 96%);"],
      oklab: ["oklab(0.63 0.24 0.09)", "0.63 0.24 0.09", "--bg: oklab(0.95 0.01 -0.03);"],
      oklch: ["oklch(0.63 0.25 20)", "0.63 0.25 20", "--accent: oklch(0.74 0.26 144);"],
      rgb: ["rgb(255 0 68)", "255 0 68", "--border: rgb(30 41 59);"],
    };
    
    return examples[sourceFormat].join('\n');
  };

  // Get the label for a format
  const getFormatLabel = (format: ColorFormat) => {
    return colorFormats.find(f => f.value === format)?.label || format.toUpperCase();
  };

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card className="w-full border-2 shadow-lg">
        <CardHeader>
          <motion.div custom={0} variants={itemVariants}>
            <CardTitle>ColorSrc</CardTitle>
            <CardDescription className="mt-2">
              Convert between multiple color formats (HEX, HSL, OKLAB, OKLCH, RGB).
              You can enter multiple lines and CSS variables (--var: value).
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="flex flex-wrap items-center gap-2 md:gap-4"
            custom={1}
            variants={itemVariants}
          >
            <div className="flex-1 min-w-[120px]">
              <Select value={sourceFormat} onValueChange={handleSourceFormatChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Source Format" />
                </SelectTrigger>
                <SelectContent>
                  {colorFormats.map((format) => (
                    <SelectItem 
                      key={format.value} 
                      value={format.value}
                      disabled={format.value !== 'auto' && format.value === targetFormat}
                    >
                      {format.value === 'auto' ? (
                        <div className="flex items-center">
                          <Wand2 className="mr-2 h-4 w-4" />
                          {format.label}
                        </div>
                      ) : format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={swapFormats}
                className={`flex-shrink-0 h-10 w-10 rounded-full ${sourceFormat === 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={sourceFormat === 'auto'}
                aria-label="Swap formats"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            
            <div className="flex-1 min-w-[120px]">
              <Select value={targetFormat} onValueChange={handleTargetFormatChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Target Format" />
                </SelectTrigger>
                <SelectContent>
                  {colorFormats
                    .filter(format => format.value !== 'auto') // Filter out auto for target format
                    .map((format) => (
                      <SelectItem 
                        key={format.value} 
                        value={format.value}
                        disabled={sourceFormat !== 'auto' && format.value === sourceFormat}
                      >
                        {format.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div custom={1.5} variants={itemVariants} className="flex items-center space-x-2">
            <Checkbox 
              id="simplified" 
              checked={simplified}
              onCheckedChange={toggleSimplified}
            />
            <Label 
              htmlFor="simplified" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Simplified output (without format name)
            </Label>
          </motion.div>

          <motion.div custom={2} variants={itemVariants} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                Input {sourceFormat === 'auto' ? '(Auto Detect)' : `(${colorFormats.find(f => f.value === sourceFormat)?.label})`}:
              </p>
            </div>
            <Textarea
              placeholder={getPlaceholder()}
              className="min-h-32 font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </motion.div>
          
          <motion.div 
            custom={3}
            variants={itemVariants}
            whileHover={!converting ? { scale: 1.02 } : {}}
            whileTap={!converting ? { scale: 0.98 } : {}}
            className="relative z-0"
          >
            <Button 
              onClick={handleConvert} 
              className="w-full relative h-11 font-medium"
              disabled={converting}
              variant="default"
              size="lg"
            >
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: converting ? 0.8 : 1 }}
              >
                {converting ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
                    />
                    <span>Converting...</span>
                  </motion.div>
                ) : (
                  <>
                    <ArrowRightLeft className="h-4 w-4 rotate-90" />
                    <span>Convert</span>
                  </>
                )}
              </motion.div>
            </Button>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {output.length > 0 && !converting && (
              <motion.div
                key="output"
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: "auto",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { duration: 0.2 }
                }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                  <p className="text-sm font-medium">
                    Output {simplified ? "(Simplified)" : `(${colorFormats.find(f => f.value === targetFormat)?.label})`}:
                  </p>
                  
                  {output.some(item => item.converted) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="h-8 group"
                    >
                      <AnimatePresence mode="wait">
                        {!copied ? (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Copy
                          </motion.span>
                        ) : (
                          <motion.div
                            key="copied"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center"
                          >
                            <Check className="mr-1 h-4 w-4" /> Copied!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 overflow-auto max-h-80 border border-gray-200 dark:border-gray-800">
                  <pre className="text-sm font-mono">
                    {output.map((item, index) => {
                      // Skip empty lines
                      if (!item.original) return null;
                      
                      return (
                        <motion.div 
                          key={index} 
                          className="mb-0.5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { 
                              delay: index * 0.05,
                              duration: 0.3
                            }
                          }}
                        >
                          {item.converted ? (
                            <div>
                              <span className="text-green-600 dark:text-green-400">
                                {item.converted}
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">
                              {item.original} {/* Display unchanged original in red */}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="text-xs text-gray-500 dark:text-gray-400 flex flex-col items-start">
          <motion.p custom={4} variants={itemVariants}>
            {sourceFormat === 'auto' ? 
              "Auto-detect will try to identify the format of each line as you type." : 
              "Text in red indicates invalid or unrecognized color format."}
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 