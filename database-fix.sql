-- Check existing table structure
SHOW TABLES;
DESCRIBE playlist_songs;

-- Drop existing join table if it has wrong structure
DROP TABLE IF EXISTS playlist_songs;

-- Create the join table with correct structure for JPA default naming
CREATE TABLE playlist_songs (
    playlist_id BIGINT NOT NULL,
    songs_id BIGINT NOT NULL,
    PRIMARY KEY (playlist_id, songs_id),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE,
    FOREIGN KEY (songs_id) REFERENCES song(id) ON DELETE CASCADE
);

-- Alternative: If your database uses different naming, try this
-- CREATE TABLE playlist_songs (
--     playlists_id BIGINT NOT NULL,
--     songs_id BIGINT NOT NULL,
--     PRIMARY KEY (playlists_id, songs_id),
--     FOREIGN KEY (playlists_id) REFERENCES playlist(id) ON DELETE CASCADE,
--     FOREIGN KEY (songs_id) REFERENCES song(id) ON DELETE CASCADE
-- );

-- Check if playlist and song tables exist and have correct structure
DESCRIBE playlist;
DESCRIBE song;

-- Sample data check (optional)
SELECT * FROM playlist LIMIT 5;
SELECT * FROM song LIMIT 5;
