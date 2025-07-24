import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DownloadButton } from '@/components/ui/download-button';
import { ExtractedFile } from '@/hooks/useZipFileExtraction';
import * as XLSX from 'xlsx';

interface PersonOfInterest {
  beneficiaryName: string;
  [key: string]: any;
}

interface PersonsOfInterestTableProps {
  poiFile: ExtractedFile | undefined;
  poiFiles: ExtractedFile[];
  onDownloadFile: (file: ExtractedFile) => void;
  onDownloadPOI: (beneficiaryName: string) => void;
}

export const PersonsOfInterestTable: React.FC<PersonsOfInterestTableProps> = ({
  poiFile,
  poiFiles,
  onDownloadFile,
  onDownloadPOI
}) => {
  const [personsData, setPersonsData] = useState<PersonOfInterest[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (poiFile) {
      parseExcelFile();
    }
  }, [poiFile]);

  const parseExcelFile = async () => {
    if (!poiFile) return;

    setIsLoading(true);
    try {
      const workbook = XLSX.read(poiFile.data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1);

        setColumns(headers);
        
        const parsedData = dataRows.map(row => {
          const rowData: PersonOfInterest = { beneficiaryName: '' };
          headers.forEach((header, index) => {
            rowData[header] = row[index] || '';
            // Assume first column or a column named 'beneficiaryName' contains the beneficiary name
            if (index === 0 || header.toLowerCase().includes('beneficiary') || header.toLowerCase().includes('name')) {
              rowData.beneficiaryName = row[index] || '';
            }
          });
          return rowData;
        });

        setPersonsData(parsedData);
      }
    } catch (error) {
      console.error('Failed to parse Excel file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPOIFile = (beneficiaryName: string) => {
    return poiFiles.some(file => 
      file.type === 'poi' && 
      file.beneficiaryName?.toLowerCase() === beneficiaryName.toLowerCase()
    );
  };

  if (!poiFile) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Persons of Interest</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Individuals flagged for suspicious financial activity
          </p>
        </div>
        <DownloadButton
          onDownload={() => onDownloadFile(poiFile)}
          variant="secondary"
          size="sm"
        >
          Download Table
        </DownloadButton>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-muted-foreground">Loading table data...</span>
          </div>
        ) : personsData.length > 0 ? (
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead key={index} className="font-semibold whitespace-nowrap">
                        {column}
                      </TableHead>
                    ))}
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personsData.map((person, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex} className="py-3">
                          {colIndex === 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{person[column]}</span>
                              {hasPOIFile(person.beneficiaryName) && (
                                <Badge variant="destructive" className="text-xs">
                                  POI
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm">{person[column]}</span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        {hasPOIFile(person.beneficiaryName) && (
                          <DownloadButton
                            onDownload={() => onDownloadPOI(person.beneficiaryName)}
                            variant="subtle"
                            size="sm"
                            className="text-xs"
                          >
                            Raw Data
                          </DownloadButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No persons of interest data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};