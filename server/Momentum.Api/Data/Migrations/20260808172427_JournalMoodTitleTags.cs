using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Momentum.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class JournalMoodTitleTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Mood",
                table: "journal_entries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "journal_entries",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "journal_entries",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mood",
                table: "journal_entries");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "journal_entries");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "journal_entries");
        }
    }
}
