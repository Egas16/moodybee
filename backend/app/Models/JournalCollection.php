<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalCollection extends Model
{
    protected $table      = 'journal_collections';
    protected $primaryKey = 'id_collection';

    protected $fillable = [
        'id_user',
        'name',
    ];

    public function journals()
    {
        return $this->hasMany(Journal::class, 'id_collection', 'id_collection');
    }
}
