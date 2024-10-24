<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class copyAsets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:copy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Copy assets to builds location';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $directories = [public_path('fonts'),
            public_path('webfonts'),
            public_path('icons'),
            public_path('scss'),
            public_path('css')];
        $destination = public_path('build');
        foreach ($directories as $source) {
            if (File::exists($source)) {
                File::copyDirectory($source, $destination);
                $this->info($source . ' copied successfully.');
            } else {
                $this->error('Source folder does not exist.');
            }
        }

        return 0;
    }
}
