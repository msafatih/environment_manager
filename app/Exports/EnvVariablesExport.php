<?php

namespace App\Exports;

use App\Models\Application;
use App\Models\EnvType;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Collection;

class EnvVariablesExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $application;
    protected $envTypes;

    public function __construct(Application $application)
    {
        $this->application = $application;
        $this->envTypes = EnvType::orderBy('id')->get();
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection(): Collection
    {
        $envVariables = $this->application->envVariables()
            ->orderBy('sequence')
            ->with(['envValues.accessKey.envType'])
            ->get();

        $rows = [];

        foreach ($envVariables as $variable) {
            $row = [
                'Variable' => $variable->name,
            ];

            foreach ($this->envTypes as $envType) {
                $row[$envType->name] = '';
            }

            foreach ($variable->envValues as $value) {
                if ($value->accessKey && $value->accessKey->envType) {
                    $envTypeName = $value->accessKey->envType->name;
                    if (array_key_exists($envTypeName, $row)) {
                        $row[$envTypeName] = $value->value;
                    }
                }
            }
            $rows[] = $row;
        }

        return collect($rows);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        $headers = ['Variable'];

        // Use the pre-fetched env types
        foreach ($this->envTypes as $envType) {
            $headers[] = $envType->name;
        }

        return $headers;
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
