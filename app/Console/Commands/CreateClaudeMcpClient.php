<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Passport\ClientRepository;

class CreateClaudeMcpClient extends Command
{
    /**
     * Callback OAuth resmi milik connector Claude (claude.ai, Cowork, Claude Desktop).
     *
     * @var array<int, string>
     */
    public const CLAUDE_REDIRECT_URIS = [
        'https://claude.ai/api/mcp/auth_callback',
        'https://claude.com/api/mcp/auth_callback',
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcp:claude-client {--name=Claude : Nama client yang tampil di layar persetujuan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat OAuth Client ID & Secret untuk menghubungkan connector Claude ke server MCP aplikasi ini';

    /**
     * Execute the console command.
     */
    public function handle(ClientRepository $clients): int
    {
        $client = $clients->createAuthorizationCodeGrantClient(
            name: (string) $this->option('name'),
            redirectUris: self::CLAUDE_REDIRECT_URIS,
            confidential: true,
        );

        $this->components->info('Client OAuth untuk Claude berhasil dibuat.');
        $this->components->twoColumnDetail('URL server MCP', url('/mcp'));
        $this->components->twoColumnDetail('OAuth Client ID', (string) $client->getKey());
        $this->components->twoColumnDetail('OAuth Client Secret', (string) $client->plainSecret);
        $this->components->warn('Simpan secret sekarang. Secret disimpan dalam bentuk hash dan tidak bisa ditampilkan lagi.');

        return self::SUCCESS;
    }
}
