<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ClearLogs extends Command
{
    protected $signature = 'log:clear';
    protected $description = 'Log dosyalarını temizler';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        File::cleanDirectory(storage_path('logs'));

        $this->info('Log dosyaları başarıyla temizlendi!');
    }
}
