"""initial migration

Revision ID: 59b7120353df
Revises: c939fde0feff
Create Date: 2024-08-12 00:24:27.477565

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '59b7120353df'
down_revision = 'c939fde0feff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('games',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('playera_won', sa.Boolean(), nullable=False),
    sa.Column('playera_resigned', sa.Boolean(), nullable=False),
    sa.Column('playerb_resigned', sa.Boolean(), nullable=False),
    sa.Column('tied', sa.Boolean(), nullable=False),
    sa.Column('completed', sa.Boolean(), nullable=False),
    sa.Column('playera_id', sa.Integer(), nullable=True),
    sa.Column('playerb_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['playera_id'], ['players.id'], name=op.f('fk_games_playera_id_players'), use_alter=True),
    sa.ForeignKeyConstraint(['playerb_id'], ['players.id'], name=op.f('fk_games_playerb_id_players'), use_alter=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('moves',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('contents', sa.String(), nullable=False),
    sa.CheckConstraint('length(contents) >= 3'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('contents')
    )
    op.create_table('players',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('color', sa.String(), nullable=False),
    sa.Column('defers', sa.Boolean(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], name=op.f('fk_players_game_id_games'), use_alter=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.CheckConstraint('length(name) >= 1'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('game_moves',
    sa.Column('game_id', sa.Integer(), nullable=False),
    sa.Column('move_id', sa.Integer(), nullable=True),
    sa.Column('number', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], name=op.f('fk_game_moves_game_id_games')),
    sa.ForeignKeyConstraint(['move_id'], ['moves.id'], name=op.f('fk_game_moves_move_id_moves')),
    sa.PrimaryKeyConstraint('game_id', 'number'),
    sa.UniqueConstraint('game_id', 'number', name='allcolsunique')
    )
    op.create_table('user_players',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('player_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['player_id'], ['players.id'], name=op.f('fk_user_players_player_id_players')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_players_user_id_users')),
    sa.PrimaryKeyConstraint('user_id', 'player_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_players')
    op.drop_table('game_moves')
    op.drop_table('users')
    op.drop_table('players')
    op.drop_table('moves')
    op.drop_table('games')
    # ### end Alembic commands ###